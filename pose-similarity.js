module.exports = function(RED) {
    function PoseSimilarity(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg, send, done) {
            const similarity = require("compute-cosine-similarity"); 
            let keypoints = JSON.parse(msg.payload)
            
            // console.log(keypoints)
            // 
            // console.log(keypoinstsPreprocessing(keypoints))
            let sample = [
                {
                    x: 0.4817624092102051,
                    y: 0.45846912264823914,
                    z: -0.7698102593421936,
                    visibility: 0.9998458027839661
                },
                {
                    x: 0.4936062693595886,
                    y: 0.40500861406326294,
                    z: -0.7621992230415344,
                    visibility: 0.9996991753578186
                },
                {
                    x: 0.502403974533081,
                    y: 0.4040256440639496,
                    z: -0.7621386647224426,
                    visibility: 0.9996520280838013
                },
                {
                    x: 0.5104445219039917,
                    y: 0.4026203453540802,
                    z: -0.7621181607246399,
                    visibility: 0.9996649026870728
                },
                {
                    x: 0.4656929075717926,
                    y: 0.4021480083465576,
                    z: -0.7685867547988892,
                    visibility: 0.9997730851173401
                },
                {
                    x: 0.4542573392391205,
                    y: 0.3997102379798889,
                    z: -0.768586277961731,
                    visibility: 0.9997762441635132
                },
                {
                    x: 0.4439796507358551,
                    y: 0.39816251397132874,
                    z: -0.7685798406600952,
                    visibility: 0.9998146295547485
                },
                {
                    x: 0.5196115970611572,
                    y: 0.4010966718196869,
                    z: -0.5862746834754944,
                    visibility: 0.9995452165603638
                },
                {
                    x: 0.42232346534729004,
                    y: 0.39792299270629883,
                    z: -0.6093929409980774,
                    visibility: 0.9998736381530762
                },
                {
                    x: 0.4940943717956543,
                    y: 0.49753955006599426,
                    z: -0.6936413049697876,
                    visibility: 0.9999092221260071
                },
                {
                    x: 0.4609544277191162,
                    y: 0.5041597485542297,
                    z: -0.6992852687835693,
                    visibility: 0.9999619722366333
                },
                {
                    x: 0.5845454931259155,
                    y: 0.615190863609314,
                    z: -0.4180196225643158,
                    visibility: 0.9996994137763977
                },
                {
                    x: 0.3380344808101654,
                    y: 0.6093859672546387,
                    z: -0.47039955854415894,
                    visibility: 0.9998713135719299
                },
                {
                    x: 0.6179484724998474,
                    y: 0.9256265163421631,
                    z: -0.31697335839271545,
                    visibility: 0.8543384671211243
                },
                {
                    x: 0.282159686088562,
                    y: 0.9437262415885925,
                    z: -0.3802521824836731,
                    visibility: 0.8950935006141663
                },
                {
                    x: 0.6231604814529419,
                    y: 1.1875196695327759,
                    z: -0.380183607339859,
                    visibility: 0.28457868099212646
                },
                {
                    x: 0.23462557792663574,
                    y: 1.219119668006897,
                    z: -0.5022183656692505,
                    visibility: 0.42301344871520996
                },
                {
                    x: 0.6372942328453064,
                    y: 1.2619297504425049,
                    z: -0.43001788854599,
                    visibility: 0.21158675849437714
                },
                {
                    x: 0.20873555541038513,
                    y: 1.2932957410812378,
                    z: -0.5520216822624207,
                    visibility: 0.31271880865097046
                },
                {
                    x: 0.6163712739944458,
                    y: 1.2666116952896118,
                    z: -0.4700315594673157,
                    visibility: 0.2814890444278717
                },
                {
                    x: 0.23067955672740936,
                    y: 1.2925909757614136,
                    z: -0.6063997149467468,
                    visibility: 0.3960041105747223
                },
                {
                    x: 0.6036989092826843,
                    y: 1.2410392761230469,
                    z: -0.4043017029762268,
                    visibility: 0.2950258255004883
                },
                {
                    x: 0.2480548918247223,
                    y: 1.26681387424469,
                    z: -0.5298413038253784,
                    visibility: 0.4079611301422119
                },
                {
                    x: 0.529731273651123,
                    y: 1.1422696113586426,
                    z: -0.006370258517563343,
                    visibility: 0.029704930260777473
                },
                {
                    x: 0.37706810235977173,
                    y: 1.1414549350738525,
                    z: 0.007632910273969173,
                    visibility: 0.031471796333789825
                },
                {
                    x: 0.5251245498657227,
                    y: 1.59298574924469,
                    z: 0.1452331840991974,
                    visibility: 0.008981773629784584
                },
                {
                    x: 0.3849889636039734,
                    y: 1.5978494882583618,
                    z: 0.1252935230731964,
                    visibility: 0.004145687911659479
                },
                {
                    x: 0.5217388868331909,
                    y: 1.983454942703247,
                    z: 0.5554765462875366,
                    visibility: 0.0010348185896873474
                },
                {
                    x: 0.3917146325111389,
                    y: 1.986128568649292,
                    z: 0.429389625787735,
                    visibility: 0.00029201325378380716
                },
                {
                    x: 0.5217303037643433,
                    y: 2.0401320457458496,
                    z: 0.5843878984451294,
                    visibility: 0.001181385014206171
                },
                {
                    x: 0.3905019164085388,
                    y: 2.042186737060547,
                    z: 0.4530583322048187,
                    visibility: 0.0003971754922531545
                },
                {
                    x: 0.5053785443305969,
                    y: 2.1258273124694824,
                    z: 0.32744300365448,
                    visibility: 0.0011948851170018315
                },
                {
                    x: 0.4157027304172516,
                    y: 2.1308703422546387,
                    z: 0.13514506816864014,
                    visibility: 0.0004240306734573096
                }
            ]
            
            sampleKeypoints = keypoinstsPreprocessing(sample)
            nowKeypoints = keypoinstsPreprocessing(keypoints)

            let output1 = cosineDistanceMatching(
                [
                    ...sampleKeypoints.xTerms,
                    ...sampleKeypoints.yTerms,
                    ...sampleKeypoints.zTerms,
                ],
                [
                    ...nowKeypoints.xTerms,
                    ...nowKeypoints.yTerms,
                    ...nowKeypoints.zTerms,
                ],
            )
            let output2 = weightedDistanceMatching(
                [
                    ...nowKeypoints.xTerms,
                    ...nowKeypoints.yTerms,
                    ...nowKeypoints.zTerms,
                    ...nowKeypoints.scores
                ],
                [
                    ...sampleKeypoints.xTerms,
                    ...sampleKeypoints.yTerms,
                    ...sampleKeypoints.zTerms,
                    ...sampleKeypoints.scores
                ],
                sampleKeypoints.xTerms.length
            )
            console.log((output1+output2)/2)

            function keypoinstsPreprocessing(keypoints) {
                // Pre-processing : Nomalization and Making Vector
                let xTerms = []
                let yTerms = []
                let zTerms = []
                let scores = []

                for ( let i = 0; i < keypoints.length; i++ ) {
                    let x = keypoints[i].x
                    let y = keypoints[i].y
                    let z = keypoints[i].z
                    let s = keypoints[i].visibility
                    
                    l2norm = Math.sqrt(x**2 + y**2 + z**2)
                    xTerms.push(x/l2norm)
                    yTerms.push(y/l2norm)
                    zTerms.push(z/l2norm)
                    scores.push(s)  
                }

                return {xTerms, yTerms, zTerms, scores}

            }

            function cosineDistanceMatching(poseVector1, poseVector2) {
                // Cosine Similarity matching
                let cosineSimilarity = similarity(poseVector1, poseVector2);
                let distance = 2 * (1 - cosineSimilarity);
                return Math.sqrt(distance);
            }

            function weightedDistanceMatching(poseVector1, poseVector2, keypointsNum) {
                // Weighted Matching using score 
                let vector1PoseXY = poseVector1.slice(0, keypointsNum*2);
                let vector1Confidences = poseVector1.slice(keypointsNum*2, poseVector1.length);
                let vector2PoseXY = poseVector2.slice(0, keypointsNum*2);
                let summation1 = 0;
                let summation2 = 0;
                for (let i = 0; i < vector1PoseXY.length; i++) {
                    let tempConf = Math.floor(i / 3);
                    let tempSum = vector1Confidences[tempConf] * Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
                    summation1 = summation1 + vector1Confidences[tempConf];
                    summation2 = summation2 + tempSum;
                }
                return 3 * summation2 / summation1;
            }
            msg.payload = "Hi";
            node.send(msg);
        });
    }
    RED.nodes.registerType("pose-similarity", PoseSimilarity)
}