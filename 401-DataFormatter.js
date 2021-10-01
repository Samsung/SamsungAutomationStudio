module.exports = function (RED) {
    const xlsx = require('xlsx');
    const fs = require("fs-extra");
    const os = require("os");
    const path = require("path");
    const xmlParser = require('fast-xml-parser');
    const he = require('he');
    var parents = [];

    function JsonFormatting(X, Y, title, type, y_label, nodeConfig) {
        //json formatting
        var result = {
            type: type,
            data: {
                labels: X,
                datasets: [{
                    label: y_label,
                    backgroundColor: ((nodeConfig && nodeConfig.backgroundColor) || "rgba(0, 0, 0, 0.1)"),
                    borderWidth: ((nodeConfig && nodeConfig.borderWidth || null)),
                    borderColor: ((nodeConfig && nodeConfig.borderColor) || "rgba(0, 0, 0, 0.1)"),
                    data: Y
                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: ((nodeConfig && Number(nodeConfig.yMin)) || Math.min.apply(Math, Y)),
                            stepSize: ((nodeConfig && Number(nodeConfig.yStepSize)) || null)

                        }
                    }]
                }
            }
        }
        return result;
    }

    function CsvParser(csvData) {
        //csv to json
        var rows = csvData.split("\r\n");
        var result = [];

        for (var rowIndex in rows) {
            var row = rows[rowIndex].split(",");
            if (rowIndex === "0") {
                var columns = row;
            } else {
                var csvData = {};
                for (var columnIndex in columns) {
                    var column = columns[columnIndex];
                    csvData[column] = row[columnIndex];
                }
                result.push(csvData);
            }
        }
        return result;
    }

    function XlsxParser(xlsxData) {
        //xlsx to json
        var sheetnames = Object.keys(xlsxData.Sheets);
        var sheetname = sheetnames[0];

        var result = xlsx.utils.sheet_to_json(xlsxData.Sheets[sheetname]);
        return result;
    }

    function XmlParser(xmlData, x_data) {
        //xml to json
        const xmlOptions = {
            attributeNamePrefix: "@_",
            attrNodeName: "attr", //default is 'false' 
            textNodeName: "#text",
            ignoreAttributes: true,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: "__cdata", //default is 'false' 
            cdataPositionChar: "\\c",
            parseTrueNumberOnly: false,
            arrayMode: false, //"strict" 
            attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }), //default is a=>a 
            tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a 
            stopNodes: ["parse-me-as-string"]
        };

        var result = xmlParser.parse(xmlData, xmlOptions);
        XmlfindAllParents(result, x_data);

        parents.forEach(key => {
            if (isNaN(key) === true) {
                result = result[key];
            }
        });

        let root = Object.keys(result)[0];
        if (isNaN(root)) {
            result = result[root];
        }

        return result;
    }

    function XmlfindAllParents(jsonObj, x_data) {
        if (jsonObj instanceof Object) {
            const keys = Object.keys(jsonObj);
            if (keys.includes(x_data)) {
                return true;
            } else {
                for (let i in keys) {
                    var key = keys[i];
                    parents.push(key);
                    var res = XmlfindAllParents(jsonObj[key], x_data);
                    if (res === false || res == undefined) {
                        parents.pop();
                    }
                }
            }
        }
    }

    function getRawData(jsonData, x_data, y_data) {
        var X = [];
        var Y = [];

        for (var row of jsonData) {
            X.push(row[x_data]);
            Y.push(row[y_data]);
        }

        return { X: X, Y: Y };
    }

    function getOverallStatistics(jsonData, y_data) {
        var total = 0;
        var count = 0;
        var min = jsonData[0][y_data];
        var max = jsonData[0][y_data];

        for (var row of jsonData) {
            total += row[y_data];
            count += 1;
            if (min > row[y_data]) min = row[y_data];
            if (max < row[y_data]) max = row[y_data];
        }

        var average = total / count;

        var X = ['min', 'max', 'count', 'total', 'average'];
        var Y = [min, max, count, total, average];

        return { X: X, Y: Y };
    }

    function getCountByItems(jsonData, x_data) {
        // count the number of x_data items
        var countByItemsJson = {};

        for (var row of jsonData) {
            if (countByItemsJson.hasOwnProperty(row[x_data])) {
                countByItemsJson[row[x_data]] += 1;
            } else {
                countByItemsJson[row[x_data]] = 1;
            }
        }

        return { X: (Object.keys(countByItemsJson)), Y: (Object.values(countByItemsJson)) };
    }

    function getTotalByItems(jsonData, x_data, y_data) {
        var totalByItems = {};

        for (var row of jsonData) {
            if (totalByItems.hasOwnProperty(row[x_data])) {
                totalByItems[row[x_data]] += row[y_data];
            } else {
                totalByItems[row[x_data]] = row[y_data];
            }
        }

        return { X: (Object.keys(totalByItems)), Y: (Object.values(totalByItems)) };
    }

    function getAverageByItems(jsonData, x_data, y_data) {
        var averageByItems = {};
        var countByItems = {};

        for (var row of jsonData) {
            if (averageByItems.hasOwnProperty(row[x_data])) {
                averageByItems[row[x_data]] += row[y_data];
                countByItems[row[x_data]] += 1;

            } else {
                averageByItems[row[x_data]] = row[y_data];
                countByItems[row[x_data]] = 1;
            }
        }

        for (key in averageByItems) {
            averageByItems[key] /= countByItems[key];
        }

        return { X: (Object.keys(averageByItems)), Y: (Object.values(averageByItems)) };
    }

    function ChartConfig(n) {
        RED.nodes.createNode(this, n);
        this.borderColor = n.borderColor
        this.borderWidth = n.borderWidth;
        this.backgroundColor = n.backgroundColor
        this.yMin = n.yMin;
        this.yStepSize = n.yStepSize;
    }

    function stringToNumber(jsonData, y_data) {
        if (typeof (jsonData[0][y_data]) === 'string' && jsonData[0][y_data].includes(',')) {
            for (var row of jsonData) {
                row[y_data] = Number(row[y_data].replace(/,/g, ""));
            }
        }

        if (typeof (jsonData[0][y_data]) === 'string') {
            for (var row of jsonData) {
                row[y_data] = Number(row[y_data]);
            }
        }

        return jsonData;
    }

    function DataFormatting(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.on('input', function (msg) {
            var type = n.data_type;
            var jsonData, data, cleanData;

            node.configId = n.config;
            RED.nodes.eachNode(function (nn) {
                if (node.configId == nn.id) {
                    node.config = nn;
                }
            });

            //data entry
            if (n.data_entry_point === 'path') {
                if (type === 'xlsx') {
                    data = xlsx.readFile(n.data_path);
                } else {
                    data = fs.readFileSync(n.data_path, { encoding: "utf8" });
                }
            } else if (n.data_entry_point === 'binary') {
                if (type === 'xlsx') {
                    var binaryData = Buffer.from(msg.data, "base64").toString('base64');
                    data = xlsx.read(binaryData);
                } else {
                    data = Buffer.from(msg.data, "base64").toString('utf8');
                }
            } else if (n.data_entry_point === 'string') {
                data = msg.payload;
            }

            if (type === 'xlsx') {
                jsonData = XlsxParser(data);
            } else if (type === 'csv') {
                jsonData = CsvParser(data);
            } else if (type === 'xml') {
                jsonData = XmlParser(data, n.x_data);
                parents = [];
            }
            jsonData = stringToNumber(jsonData, n.y_data);

            //data formatting
            if (n.result_data_type === 'totalByItems') {
                cleanData = getTotalByItems(jsonData, n.x_data, n.y_data);

            } else if (n.result_data_type === 'countByItems') {
                cleanData = getCountByItems(jsonData, n.y_data);

            } else if (n.result_data_type === 'averageByItems') {
                cleanData = getAverageByItems(jsonData, n.x_data, n.y_data);

            } else if (n.result_data_type === 'overallStatistics') {
                cleanData = getOverallStatistics(jsonData, n.x_data, n.y_data);

            } else {
                cleanData = getRawData(jsonData, n.x_data, n.y_data);
            }


            msg.data = JsonFormatting(cleanData.X, cleanData.Y, n.title, n.chart_type, n.y_label, node.config);
            node.send(msg);
        })
    }

    RED.nodes.registerType("data-formatter", DataFormatting);
    RED.nodes.registerType("chart-config", ChartConfig);
}