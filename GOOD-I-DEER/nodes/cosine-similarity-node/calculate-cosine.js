const ERROR_VECTOR_LENGTH_ZERO = -100;
const ERROR_COSINE_SIMILARITY_NAN = -200;
const ERROR_FILE_PARSING = -500;

module.exports = function (RED) {
  function CalculateCosine(config) {
    RED.nodes.createNode(this, config);

    function devideSimilarity(ArrayA, ArrayB) {
      let resultArray = [];
      for (let i = 0; i < ArrayA.length; i++) {
        let resultCosineSimilarity = cosineSimilarity(ArrayA[i], ArrayB);
        if (resultCosineSimilarity === ERROR_VECTOR_LENGTH_ZERO || resultCosineSimilarity === ERROR_COSINE_SIMILARITY_NAN) {
          return resultCosineSimilarity;
        }
        resultArray.push(resultCosineSimilarity);
      }
      return resultArray;
    }

    function cosineSimilarity(vectorA, ArrayB) {
      let resultArray = [];

      for (let i = 0; i < ArrayB.length; i++) {
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
          return ERROR_VECTOR_LENGTH_ZERO;
        }

        const similarity = dotProduct / (magnitudeA * magnitudeB);
        if (isNaN(similarity)) return ERROR_COSINE_SIMILARITY_NAN;
        resultArray.push(similarity);
      }
      return resultArray;
    }

    async function getStoredVector() {
      let stored = [[0]];
      const fs = require("fs");
      const filePath = config.file;
      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        stored = JSON.parse(data);
      } catch (err) {
        return ERROR_FILE_PARSING;
      }
      return stored;
    }

    this.on("input", async function (msg) {
      let input_vectors = msg.payload;
      let stored_vectors = await getStoredVector();

      if (!input_vectors) {
        this.error("Input vector is not valid.");
      } else if (stored_vectors == ERROR_FILE_PARSING) {
        this.error("Stored vector is not valid. Error occured while parsing file.");
      } else {
        let result = devideSimilarity(input_vectors, stored_vectors);
        switch (result) {
          case ERROR_VECTOR_LENGTH_ZERO:
            this.error("The Vector length is 0, can not calculate.", "Error");
            break;
          case ERROR_COSINE_SIMILARITY_NAN:
            this.error("The cosine similarity is Nan.", "Error");
            break;
          default:
            msg.payload = result;
            this.send(msg);
        }
      }

    });
  }
  RED.nodes.registerType("calculate-cosine", CalculateCosine);
};
