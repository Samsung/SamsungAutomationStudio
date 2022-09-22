module.exports = function(RED){

    function ObjectDetectionNode(config){
        RED.nodes.createNode(this, config)
            var node = this;
            
        function HTML() {
            return require('./object-detection-html.js').code(config)
        }

            node.on('input', function(msg, send){


                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://ssafy:S005ssafy@J7S005.p.ssafy.io:27017/?authMechanism=DEFAULT";
                const options = {useUnifiedTopology: true}; 
                MongoClient.connect(url, options, function(err, db) {
        
                    if (err){
                        console.log(err);
                        throw err;
                    } 
        
                    var dbo = db.db("flow_db");
                    dbo.collection("hero").find({}, { projection: { _id: '632ab390e636be5492727f00' } }).toArray(function(err, result) {
            
                        if (err){
                            console.log(err);
                            throw err;
                        } 
                    
                        console.log("res : " + result);
                    
                        db.close();
                    
                      });
            
            });


                console.log("config" + config)
                config.savedData = msg.payload.registered;
                console.log("msg payload. reg : " + msg.payload["registered"]);
                console.log("msg payload : " + msg.payload);
                console.log("each msg payload : " + msg.payload[0] + msg.payload[1]);
                console.log("console log : " + config.savedData);
                msg.payload = HTML()
                send = send || function(){this.send.apply(this, arguments)}
                send(msg)
            })
    }

    RED.nodes.registerType("object-detection", ObjectDetectionNode);
}
