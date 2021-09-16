module.exports = function(RED) {
    function PoseSimilarity(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg, send, done) {
            const similarity = require("compute-cosine-similarity"); 
            let keypoints = JSON.parse(msg.payload)
            
            sample = [
                {
                    x: 0.5747062563896179,
                    y: 0.4066506624221802,
                    z: -0.9112027287483215,
                    visibility: 0.9999215602874756
                },
                {
                    x: 0.5866062641143799,
                    y: 0.3473609387874603,
                    z: -0.898028552532196,
                    visibility: 0.9998391270637512
                },
                {
                    x: 0.5959856510162354,
                    y: 0.3474617600440979,
                    z: -0.8972940444946289,
                    visibility: 0.9997789263725281
                },
                {
                    x: 0.6042131185531616,
                    y: 0.3469957709312439,
                    z: -0.8980273008346558,
                    visibility: 0.9997367262840271
                },
                {
                    x: 0.5535554885864258,
                    y: 0.34255245327949524,
                    z: -0.9140981435775757,
                    visibility: 0.999924898147583
                },
                {
                    x: 0.5404933094978333,
                    y: 0.3399371802806854,
                    z: -0.9140849113464355,
                    visibility: 0.9999299645423889
                },
                {
                    x: 0.5277708768844604,
                    y: 0.3379674553871155,
                    z: -0.9140845537185669,
                    visibility: 0.9999411106109619
                },
                {
                    x: 0.6041008234024048,
                    y: 0.3492162525653839,
                    z: -0.6894615888595581,
                    visibility: 0.9997290372848511
                },
                {
                    x: 0.4962088167667389,
                    y: 0.34016531705856323,
                    z: -0.7658218741416931,
                    visibility: 0.9999710321426392
                },
                {
                    x: 0.582728385925293,
                    y: 0.45060861110687256,
                    z: -0.8215945363044739,
                    visibility: 0.9999464750289917
                },
                {
                    x: 0.5492018461227417,
                    y: 0.45132675766944885,
                    z: -0.842786967754364,
                    visibility: 0.999986469745636
                },
                {
                    x: 0.6481769680976868,
                    y: 0.5653575658798218,
                    z: -0.4546165466308594,
                    visibility: 0.9997624158859253
                },
                {
                    x: 0.3770679831504822,
                    y: 0.5576112866401672,
                    z: -0.5854411125183105,
                    visibility: 0.999977171421051
                },
                {
                    x: 0.6429665088653564,
                    y: 0.7942731976509094,
                    z: -0.06745405495166779,
                    visibility: 0.8866057395935059
                },
                {
                    x: 0.2910415530204773,
                    y: 0.8575465679168701,
                    z: -0.4180843234062195,
                    visibility: 0.9845975041389465
                },
                {
                    x: 0.6301985383033752,
                    y: 1.0686594247817993,
                    z: 0.12654970586299896,
                    visibility: 0.35036349296569824
                },
                {
                    x: 0.2632238566875458,
                    y: 1.1936697959899902,
                    z: -0.41257113218307495,
                    visibility: 0.6956201791763306
                },
                {
                    x: 0.6401009559631348,
                    y: 1.1512751579284668,
                    z: 0.15113599598407745,
                    visibility: 0.26908233761787415
                },
                {
                    x: 0.24309027194976807,
                    y: 1.2793532609939575,
                    z: -0.42840415239334106,
                    visibility: 0.5567180514335632
                },
                {
                    x: 0.6212316155433655,
                    y: 1.1468985080718994,
                    z: 0.11414127051830292,
                    visibility: 0.3027908205986023
                },
                {
                    x: 0.27280905842781067,
                    y: 1.279313325881958,
                    z: -0.47806820273399353,
                    visibility: 0.6154868602752686
                },
                {
                    x: 0.6136063933372498,
                    y: 1.1363861560821533,
                    z: 0.1184360533952713,
                    visibility: 0.3139689266681671
                },
                {
                    x: 0.28665536642074585,
                    y: 1.2404080629348755,
                    z: -0.42932090163230896,
                    visibility: 0.6263441443443298
                },
                {
                    x: 0.5563026666641235,
                    y: 1.0931206941604614,
                    z: 0.018255433067679405,
                    visibility: 0.16300508379936218
                },
                {
                    x: 0.4019245505332947,
                    y: 1.115423321723938,
                    z: -0.017303040251135826,
                    visibility: 0.20045308768749237
                },
                {
                    x: 0.5289310216903687,
                    y: 1.6041017770767212,
                    z: 0.20637676119804382,
                    visibility: 0.016674384474754333
                },
                {
                    x: 0.3944813013076782,
                    y: 1.5989164113998413,
                    z: 0.08016983419656754,
                    visibility: 0.011937452480196953
                },
                {
                    x: 0.5030412077903748,
                    y: 2.0019679069519043,
                    z: 0.6629712581634521,
                    visibility: 0.0015568474773317575
                },
                {
                    x: 0.3640366196632385,
                    y: 2.0039117336273193,
                    z: 0.408647358417511,
                    visibility: 0.0011314389994367957
                },
                {
                    x: 0.4931778013706207,
                    y: 2.0565028190612793,
                    z: 0.6943466067314148,
                    visibility: 0.0011479948880150914
                },
                {
                    x: 0.3537369966506958,
                    y: 2.0598084926605225,
                    z: 0.4315360188484192,
                    visibility: 0.001483823056332767
                },
                {
                    x: 0.4993167817592621,
                    y: 2.1468515396118164,
                    z: 0.4452536106109619,
                    visibility: 0.0037718492094427347
                },
                {
                    x: 0.383365660905838,
                    y: 2.1454927921295166,
                    z: 0.10924339294433594,
                    visibility: 0.0016091909492388368
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
                ],
                nowKeypoints.xTerms.length
            )
            

            console.log(output1, output2)
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
                    
                    l2norm = x**2 + y**2 + z**2
                    
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
                

                return {xTerms, yTerms, zTerms, scores}

            }

            function cosineDistanceMatching(poseVector1, poseVector2) {
                // Cosine Similarity matching
                let cosineSimilarity = similarity(poseVector1, poseVector2)
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
                for (let i = 0; i < vector1Confidences.length; i++) {
                    let tempSum = 0
                    tempSum += Math.abs(vector1PoseXY[i] - vector2PoseXY[i])
                    tempSum += Math.abs(vector1PoseXY[keypointsNum + i] - vector2PoseXY[keypointsNum + i])
                    tempSum += Math.abs(vector1PoseXY[keypointsNum*2 + i] - vector2PoseXY[keypointsNum*2 + i])

                    summation1 += vector1Confidences[i]
                    summation2 += tempSum * vector1Confidences[i]
                }
                return summation2 / summation1;
            }
            msg.payload = "Hi";
            node.send(msg);
        });
    }
    RED.nodes.registerType("pose-similarity", PoseSimilarity)
}