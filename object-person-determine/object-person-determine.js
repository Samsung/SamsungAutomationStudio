module.exports = function (RED) {
    function ObjectPersonDetermineNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {

            let inputList = null;
            let isLog = null;
            let date = null;
            if(msg.payload.log !== undefined){
                inputList = msg.payload.log.data;
                isLog = true;
                date = msg.payload.log.date
            }
            else{
                inputList = msg.payload.data;
                isLog = false;
            }
            let objects = [];
            let person = {};

        
            inputList.forEach(object => {
                let centerX = object.bbox[0] + object.bbox[2] / 2;
                let centerY = object.bbox[1] + object.bbox[3] / 2;
                let _class = object['class'];
                let diameter = Math.sqrt(Math.pow(centerX - object.bbox[0], 2) + Math.pow(centerY - object.bbox[1], 2)) * 1.2;
                if (object.class === 'person') person = { centerX, centerY, diameter };
                else objects.push({ centerX, centerY, diameter, 'class': _class, distance: -1 });
            });


            if (person === undefined || objects.length === 0) {
                msg.payload = { object: 'default', isLog , date};
                node.send(msg)
                return
            }
            let determine = objects[0];
            objects.forEach(object => {
                let distance = Math.sqrt(Math.pow(Math.abs(object.centerX - person.centerX), 2) + Math.pow(Math.abs(object.centerY - person.centerY), 2));
                if (distance <= object.diameter) {
                    if (determine.distance == -1 || determine.distance > distance) {
                        determine = object
                        determine.distance = distance;
                    }
                }
            });


            if (determine.distance == -1) return;

            msg.payload = { object: determine['class'], isLog , date};

            node.send(msg);
        });
    }
    RED.nodes.registerType("object-person-determine", ObjectPersonDetermineNode);
}