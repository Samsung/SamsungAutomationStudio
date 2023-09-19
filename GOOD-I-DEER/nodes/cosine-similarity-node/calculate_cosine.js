module.exports = function (RED) {
    function CalculateCosine(config) {
        RED.nodes.createNode(this, config);

        // function that calculates cosine similarity of Vector A and Vetor B
        function cosineSimilarity(vectorA, vectorB) {
            // calculate DotProduct
            const dotProduct = vectorA.reduce((accumulator, currentValue, index) => {
                return accumulator + currentValue * vectorB[index];
            }, 0);
            // calculate norm of Vector A
            const magnitudeA = Math.sqrt(vectorA.reduce((accumulator, currentValue) => {
                return accumulator + currentValue * currentValue;
            }, 0));
            // calculate norm of Vector B
            const magnitudeB = Math.sqrt(vectorB.reduce((accumulator, currentValue) => {
                return accumulator + currentValue * currentValue;
            }, 0));
            // calculate cosine similarity
            const similarity = dotProduct / (magnitudeA * magnitudeB);
            return similarity;
        }

        async function getStoredVector() {
            var stored = [0, 0, 0];
            
            const fs = require('fs');
            const filePath = 'C:\\SSAFY\\NodeRED\\CustomNode\\custom_cosine\\stored.txt';

            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                stored = JSON.parse(data);
            } catch (err) {
                console.error('Error occured while parsing file.', parseError);
            }
            return stored;
        }

        this.on('input', async function (msg) {
            var input_vector = JSON.parse(msg.payload);
            var stored_vector = await getStoredVector();

            console.log("input vector: ", input_vector);
            console.log("stored vector: ", stored_vector);

            var result = 1;
            if (typeof input_vector == "undefined" || input_vector == null || input_vector == "") {
                console.error("Input vector is not valid.");
            } else if (typeof stored_vector == "undefined" || stored_vector == null || stored_vector == "") {
                console.error("Stored vector is not valid.");
            } else {
                result = cosineSimilarity(input_vector, stored_vector);
            }
            
            this.send(result);
        });
    }
    RED.nodes.registerType("calculate_cosine", CalculateCosine);
}
