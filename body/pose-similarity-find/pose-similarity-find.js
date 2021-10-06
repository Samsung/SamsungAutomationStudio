module.exports = function(RED) {
    function PoseSimilarity(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg, send, done) {
            const similarity = require("compute-cosine-similarity");
            const inputKeypoints =  msg.inputKeypoints
            const savedKeypoints = msg.savedKeypoints

            // Kepoints Number Check
            if (inputKeypoints.length == 0) {
                msg.status = false
                msg.poseName = null
                msg.accuracy = 0
                node.send(msg)
                return
            }

            //Define Initial Variable
            const keypointsNum = inputKeypoints[0].length
            let isExist = false
            let similarPoseName
            let accuracy = 0.0
            let similarLimit = config.similarSensitivity

            // Input keypoints Preprocessing
            let inputVectors = []

            for ( let inputKeypoint of inputKeypoints) {
                inputVectors.push(keypoinstsPreprocessing(inputKeypoint))
            } 

            // Saved keypoints Iteration
            for ( let name in savedKeypoints ) {
                let savedVector = keypoinstsPreprocessing(savedKeypoints[name])
                let matchingValues = []
                for (let inputVector of inputVectors) {
                    cosineMatching = 100*(1 - cosineDistanceMatching(inputVector, savedVector, keypointsNum) / Math.sqrt(2))
                    weightedMatching = 100*(1-weightedDistanceMatching(inputVector, savedVector, keypointsNum) / 0.2)

                    matchingValues.push( (cosineMatching + weightedMatching) / 2 )
                }

                // Evaluating Matching Values
                
                // Using Mean value
                let sum = 0
                for (let value of matchingValues) {
                    sum += value
                }
                meanValue = sum / matchingValues.length

                // Determine Similarity
                if ( meanValue > similarLimit ) {
                    isExist = true
                    similarLimit = meanValue
                    similarPoseName = name
                    accuracy = meanValue
                }

            }

            // Return Value
            if ( isExist ) {
                msg.status = true
                msg.poseName = similarPoseName
                msg.similarity = accuracy
            } else {
                msg.status = false
                msg.poseName = null
                msg.similarity = 0
            }
            function keypoinstsPreprocessing(keypoints) {
                // Pre-processing : Nomalization and Making Vector
                let xTerms = []
                let yTerms = []
                let zTerms = []
                let scores = []
                let l2norm = 0

                for ( let i = 0; i < keypoints.length; i++ ) {
                    let x = keypoints[i].x
                    let y = keypoints[i].y
                    let z = keypoints[i].z
                    let s = keypoints[i].visibility
                
                    l2norm += x**2 + y**2 + z**2
                
                    xTerms.push(x)
                    yTerms.push(y)
                    zTerms.push(z)
                    scores.push(s)  
                }

                l2norm = Math.sqrt(l2norm)

                for ( let i = 0; i < keypoints.length; i++) {
                    xTerms[i] /= l2norm
                    yTerms[i] /= l2norm
                    zTerms[i] /= l2norm
                }
                return [...xTerms, ...yTerms, ...zTerms, ...scores]

            }

            function cosineDistanceMatching(poseVector1, poseVector2, keypointsNum) {
                // Cosine Similarity matching
                let cosineSimilarity = similarity(poseVector1.slice(0,keypointsNum*3), poseVector2.slice(0,keypointsNum*3))
                let distance = 2 * (1 - cosineSimilarity)
                return Math.sqrt(distance);
            }

            function weightedDistanceMatching(poseVector1, poseVector2, keypointsNum) {
                // Weighted Matching using score 
                // poseVector1 : 인풋 포즈
                // poseVector2 : 저장된 포즈 
                let vector1PoseXY = poseVector1.slice(0, keypointsNum*3)
                let vector1Confidences = poseVector1.slice(keypointsNum*3, poseVector1.length)
                let vector2PoseXY = poseVector2.slice(0, keypointsNum*3)
                let summation1 = 0
                let summation2 = 0
                for (let i = 0; i <  keypointsNum; i++) {
                    let tempSum = 0
                    tempSum += Math.abs(vector1PoseXY[i] - vector2PoseXY[i])
                    tempSum += Math.abs(vector1PoseXY[keypointsNum + i] - vector2PoseXY[keypointsNum + i])
                    tempSum += Math.abs(vector1PoseXY[keypointsNum*2 + i] - vector2PoseXY[keypointsNum*2 + i])

                    summation1 += vector1Confidences[i]
                    summation2 += tempSum * vector1Confidences[i]
                }
                return summation2 / summation1;
            }
            node.send(msg)

        })
    }
    RED.nodes.registerType("pose-similarity-find", PoseSimilarity)
}