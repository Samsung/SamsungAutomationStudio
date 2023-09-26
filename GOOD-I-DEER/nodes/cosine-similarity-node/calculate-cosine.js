module.exports = function (RED) {
  function CalculateCosine(config) {
    RED.nodes.createNode(this, config);

    function devideSimilarity(ArrayA, ArrayB) {
      var resultArray = [];
      for (var i = 0; i < ArrayA.length; i++) {
        let resultCosineSimilarity = cosineSimilarity(ArrayA[i], ArrayB);
        if (!resultCosineSimilarity || isNaN(resultCosineSimilarity)) return false;
        resultArray.push(resultCosineSimilarity);
      }
      return resultArray;
    }

    function cosineSimilarity(vectorA, ArrayB) {
      var resultArray = [];

      for (var i = 0; i < ArrayB.length; i++) {
        let vectorB = ArrayB[i];

        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < vectorA.length; i++) {
          dotProduct += vectorA[i] * vectorB[i];
          magnitudeA += vectorA[i] * vectorA[i];
          magnitudeB += vectorB[i] * vectorB[i];
        }
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);

        if (magnitudeA === 0 || magnitudeB === 0) {
          return false;
        }

        const similarity = dotProduct / (magnitudeA * magnitudeB);
        resultArray.push(similarity);
      }
      return resultArray;
    }

    async function getStoredVector() {
      var stored = [[0]];

      const fs = require("fs");
      const filePath = config.file;

      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        stored = JSON.parse(data);
      } catch (err) {
        console.error("Error occured while parsing file.", err);
        return false;
      }
      return stored;
    }

    this.on("input", async function (msg) {
      var input_vectors = JSON.parse(msg.payload);
      var stored_vectors = await getStoredVector();

      if (!stored_vectors) {
        this.error("There is no such file or directory.", "Error");
      } else {
        var result = false;
        if (!input_vectors) {
          this.error("Input vector is not valid.");
        } else if (!stored_vectors) {
          this.error("Stored vector is not valid.");
        } else {
          result = devideSimilarity(input_vectors, stored_vectors);
        }

        if (!result) {
          this.error("The Vector is not available to calculate.", "Error");
        } else {
          msg.payload = result;
          this.send(msg);
        }
      }

    });
  }
  RED.nodes.registerType("calculate-cosine", CalculateCosine);
};
