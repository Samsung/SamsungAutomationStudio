module.exports = function(RED) {
    const xlsx = require('xlsx');
    const fs = require('fs-extra');
    const xmlParser = require('fast-xml-parser');
    const he = require('he');
    let parents = [];

    function JsonFormatting(X, Y, title, type, nodeConfig, y_label, isReverse) {
        //json formatting
        try {
            var min = Math.min.apply(Math, Y);
            if (nodeConfig && nodeConfig.yMin) {
                min = Number(nodeConfig.yMin);
            }

            let result = {
                type: type,
                data: {
                    labels: isReverse ? X.reverse() : X,
                    datasets: [{
						label: y_label,
                        backgroundColor:
                            (nodeConfig && nodeConfig.backgroundColor) ||
                            'rgba(0, 0, 0, 0.1)',
                        borderWidth: (nodeConfig && nodeConfig.borderWidth) || null,
                        borderColor:
                            (nodeConfig && nodeConfig.borderColor) || 'rgba(0, 0, 0, 0.1)',
                        data: isReverse ? Y.reverse() : Y,
                    }, ],
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
						display: true,
                    },
                    title: {
                        display: true,
                        text: title,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: min,
                                stepSize:
                                    (nodeConfig && Number(nodeConfig.yStepSize)) || null,
                            },
                        }, ],
                    },
                },
            };
            return result;
        } catch (error) {
            throw new Error('Failed to formatting. ' + error);
        }
    }

    function CsvParser(csvData) {
        //csv to json
        try {
            let rows = csvData.split('\r\n');
            let result = [];

            for (let rowIndex in rows) {
                var row = rows[rowIndex].split(',');
                if (rowIndex === '0') {
                    var columns = row;
                } else {
                    let csvData = {};
                    for (let columnIndex in columns) {
                        let column = columns[columnIndex];
                        csvData[column] = row[columnIndex];
                    }
                    result.push(csvData);
                }
            }
            return result;
        } catch (error) {
            throw new Error('Failed to parse CSV. ' + error);
        }
    }

    function XlsxParser(xlsxData) {
        //xlsx to json
        try {
            let sheetnames = Object.keys(xlsxData.Sheets);
            let sheetname = sheetnames[0];

            let result = xlsx.utils.sheet_to_json(xlsxData.Sheets[sheetname]);
            return result;
        } catch (error) {
            throw new Error('Failed to parse XLSX. ' + error);
        }
    }

    function XmlParser(xmlData, y_data) {
        //xml to json
        try {
            const xmlOptions = {
                attributeNamePrefix: '@_',
                attrNodeName: 'attr', //default is 'false'
                textNodeName: '#text',
                ignoreAttributes: true,
                ignoreNameSpace: false,
                allowBooleanAttributes: false,
                parseNodeValue: true,
                parseAttributeValue: false,
                trimValues: true,
                cdataTagName: '__cdata', //default is 'false'
                cdataPositionChar: '\\c',
                parseTrueNumberOnly: false,
                arrayMode: false, //'strict'
                attrValueProcessor: (val, attrName) =>
                    he.decode(val, { isAttributeValue: true }), //default is a=>a
                tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
                stopNodes: ['parse-me-as-string'],
            };

            let result = xmlParser.parse(xmlData, xmlOptions);
            parents = [];
            findAllParents(result, y_data);

            parents.forEach((key) => {
                if (isNaN(key) === true) {
                    result = result[key];
                }
            });

            let root = Object.keys(result)[0];
            if (isNaN(root)) {
                result = result[root];
            }
            return result;
        } catch (error) {
            throw new Error('Failed to parse XML. ' + error);
        }
    }

    function jsonParser(jsonData, y_data) {
        try {
            let result = JSON.parse(jsonData);;
            parents = [];
            findAllParents(result, y_data);

            parents.forEach((key) => {
                if (isNaN(key) === true) {
                    result = result[key];
                }
            });

            let root = Object.keys(result)[0];
            if (isNaN(root)) {
                result = result[root];
            }
            return result;
        } catch (error) {
            throw new Error('Failed to parse JSON. ' + error);
        }
    }

    function findAllParents(jsonObj, y_data) {
        try {
            if (jsonObj instanceof Object) {
                const keys = Object.keys(jsonObj);
                if (keys.includes(y_data)) {
                    return true;
                } else {
                    for (let i in keys) {
                        let key = keys[i];
                        parents.push(key);
                        let res = findAllParents(jsonObj[key], y_data);
                        if (res === false || res === undefined) {
                            parents.pop();
                        }
                    }
                }
            }
        } catch (error) {
            throw new Error('Failed to find all parents. ' + error);
        }
    }

    function getRawData(jsonData, x_data, y_data) {
        try {
            let X = [];
            let Y = [];

            for (let row of jsonData) {
                X.push(row[x_data]);
                Y.push(row[y_data]);
            }
            return { X: X, Y: Y };
        } catch (error) {
            throw new Error('Failed to get raw data. ' + error);
        }
    }

    function getTotalByItems(jsonData, x_data, y_data) {
        try {
            let totalByItems = {};

            for (let row of jsonData) {
                if (totalByItems.hasOwnProperty(row[x_data])) {
                    totalByItems[row[x_data]] += row[y_data];
                } else {
                    totalByItems[row[x_data]] = row[y_data];
                }
            }
            return { X: Object.keys(totalByItems), Y: Object.values(totalByItems) };
        } catch (error) {
            throw new Error('Failed to get total by items. ' + error);
        }
    }

    function getCountByItems(jsonData, x_data) {
        // count the number of x_data items
        try {
            let countByItemsJson = {};

            for (let row of jsonData) {
                if (countByItemsJson.hasOwnProperty(row[x_data])) {
                    countByItemsJson[row[x_data]] += 1;
                } else {
                    countByItemsJson[row[x_data]] = 1;
                }
            }

            return {
                X: Object.keys(countByItemsJson),
                Y: Object.values(countByItemsJson),
            };
        } catch (error) {
            throw new Error('Failed to get total by items. ' + error);
        }
    }

    function getAverageByItems(jsonData, x_data, y_data) {
        try {
            let averageByItems = {};
            let countByItems = {};

            for (let row of jsonData) {
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

            return {
                X: Object.keys(averageByItems),
                Y: Object.values(averageByItems),
            };
        } catch (error) {
            throw new Error('Failed to get average by items. ' + error);
        }
    }

    function getOverallStatistics(jsonData, y_data) {
        try {
            let total = 0;
            let count = 0;
            let min = jsonData[0][y_data];
            let max = jsonData[0][y_data];

            for (let row of jsonData) {
                total += row[y_data];
                count += 1;
                if (min > row[y_data]) min = row[y_data];
                if (max < row[y_data]) max = row[y_data];
            }

            let average = total / count;

            let X = ['최소', '최대', '평균'];
            let Y = [min, max, average];

            return { X: X, Y: Y };
        } catch (error) {
            throw new Error('Failed to get overall statistics. ' + error);
        }
    }

    function stringToNumber(jsonData, y_data) {
        try {
            if (
                typeof jsonData[0][y_data] === 'string' &&
                jsonData[0][y_data].includes(',')
            ) {
                for (let row of jsonData) {
                    row[y_data] = Number(row[y_data].replace(/,/g, ''));
                }
            }

            if (typeof jsonData[0][y_data] === 'string') {
                for (let row of jsonData) {
                    row[y_data] = Number(row[y_data]);
                }
            }
            return jsonData;
        } catch (error) {
            throw new Error('Failed to convert string to number. ' + error);
        }
    }

    function ChartConfig(n) {
        RED.nodes.createNode(this, n);
        this.borderColor = n.borderColor;
        this.borderWidth = n.borderWidth;
        this.backgroundColor = n.backgroundColor;
        this.yMin = n.yMin;
        this.yStepSize = n.yStepSize;
    }

    function DataFormatting(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.status({});

        node.on('input', function(msg) {
            let type = n.data_type;
            let jsonData, data, cleanData;

            node.configId = n.config;
            RED.nodes.eachNode(function(nn) {
                if (node.configId === nn.id) {
                    node.config = nn;
                }
            });

            try {
                // error handling
                if ((node.config.yStepSize !== '' && isNaN(Number(node.config.yStepSize))) 
                    || (node.config.yStepSize !== '' && (Number(node.config.yStepSize)<=0))){
                    throw new Error('Invalid yStepSize') 
                }
                if ((node.config.borderWidth !== '' && isNaN(Number(node.config.borderWidth)))
                    || (Number(node.config.borderWidth)<0)){
                    throw new Error('Invalid borderWidth')
                }
                if ((node.config.yMin !== '' && isNaN(Number(node.config.yMin)))) {
                    throw new Error('Invalid yMin')
                }
                if (n.result_data_type !== 'overallStatistics' && !n.x_data) {
                    throw new Error('Missing X-axes');
                }
                if (n.result_data_typepe !== 'countByItems' && !n.y_data) {
                    throw new Error('Missing Y-axes');
                }
                if (n.data_entry_point === 'binary' && type !== msg.dataFormat) {
                    throw new Error('Invalid Data Format');
                }

                // get data
                if (n.data_entry_point === 'path') {
                    if (type === 'xlsx') {
                        data = xlsx.readFile(n.data_path);
                    } else {
                        data = fs.readFileSync(n.data_path, { encoding: 'utf8' });
                    }
                } else if (n.data_entry_point === 'binary') {
                    if (type === 'xlsx') {
                        let binaryData = Buffer.from(msg.data, 'base64').toString('base64');
                        data = xlsx.read(binaryData);
                    } else {
                        data = Buffer.from(msg.data, 'base64').toString('utf8');
                    }
                } else if (n.data_entry_point === 'string') {
                    data = msg.payload;
                }

                // get entry
                if (type === 'csv') {
                    jsonData = CsvParser(data);
                } else if (type === 'xlsx') {
                    jsonData = XlsxParser(data);
                } else if (type === 'xml') {
                    jsonData = XmlParser(data, n.y_data);
                } else if (type === 'json') {
                    jsonData = jsonParser(data, n.y_data);
                }

                // get clean data
                if (n.result_data_type !== 'countByItems') {
                    jsonData = stringToNumber(jsonData, n.y_data);
                }

                switch (n.result_data_type) {
                    case 'raw':
                        cleanData = getRawData(jsonData, n.x_data, n.y_data);
                        break;
                    case 'totalByItems':
                        cleanData = getTotalByItems(jsonData, n.x_data, n.y_data);
                        break;
                    case 'countByItems':
                        cleanData = getCountByItems(jsonData, n.x_data);
                        break;
                    case 'averageByItems':
                        cleanData = getAverageByItems(jsonData, n.x_data, n.y_data);
                        break;
                    case 'overallStatistics':
                        cleanData = getOverallStatistics(jsonData, n.y_data);
                }

				if (!n.y_label) n.y_label = n.y_data;
                
                // formatting data
                msg.data = JsonFormatting(cleanData.X, cleanData.Y, n.title, n.chart_type, node.config, n.y_label, n.isReverse);
                node.send(msg);
            } catch (error) {
                node.status({ fill: 'red', shape: 'dot', text: 'error' });
                node.error(error.toString(), msg);
            }
        });
    }

    RED.nodes.registerType('data-formatter', DataFormatting);
    RED.nodes.registerType('chart-config', ChartConfig);
};