module.exports = function (RED) {
    function ObjectPersonDetermineNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {

            let inputList = msg.payload.log || msg.payload.detect;
            let savedObject = msg.payload.saveData || [];
            let isLog = msg.payload.log !== undefined ? true : false;
            let objects = [];
            let person = {};

            
            let objectList = [];
            inputList.array.forEach(item => {
                if (savedObject.length > 0 && savedObject.find(item['class'])) objectList.push(item);
            });

            objectList.forEach(object => {
                let centerX = object.bbox[0] + object.bbox[2] / 2;
                let centerY = object.bbox[1] + object.bbox[3] / 2;
                let _class = object['class'];
                let diameter = Math.sqrt(Math.pow(centerX - object.bbox[0], 2) + Math.pow(centerY - object.bbox[1], 2)) * 1.2;
                if (object.class === 'person') person = { centerX, centerY, diameter };
                else objects.push({ centerX, centerY, diameter, 'class': _class, distance: -1 });
            });


            if (person === undefined) return;
            let determine = objects[0];
            if (determine === undefined) return;
            objects.forEach(object => {
                let distance = Math.sqrt(Math.pow(Math.abs(object.centerX - person.centerX), 2) + Math.pow(Math.abs(object.centerY - person.centerY), 2));
                if (distance <= object.diameter) {
                    console.log(determine.distance == -1);
                    if (determine.distance == -1 || determine.distance > distance) {
                        determine = object
                        determine.distance = distance;
                    }
                }
            });


            if (determine.distance == -1) return;

            msg.payload = { object: determine['class'], isLog };

            node.send(msg);
        });
    }
    RED.nodes.registerType("object-person-determine", ObjectPersonDetermineNode);
}