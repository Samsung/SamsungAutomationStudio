module.exports = function (RED) {
  function CalculateCosine(config) {
    RED.nodes.createNode(this, config);

    function cosineSimilarity(vectorA, vectorB) {
      if (vectorA.length !== vectorB.length || vectorA.length === 0 || vectorB.length === 0) {
        throw new Error("These two vectors has different length or size 0.");
      }

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
        throw new Error("Can't calculate cosine similarity of 0 Vector.");
      }
      const similarity = dotProduct / (magnitudeA * magnitudeB);
      return similarity;
    }

    async function getStoredVector() {
      var stored = [0, 0, 0];

      const fs = require("fs");
      const filePath = config.file;

      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        stored = JSON.parse(data);
      } catch (err) {
        console.error("Error occured while parsing file.", err);
      }
      return stored;
    }

    this.on("input", async function (msg) {
      var input_vector = msg.payload;
      var stored_vector = await getStoredVector();

      var result = 1;
      if (typeof input_vector == "undefined" || input_vector == null || input_vector == "") {
        console.error("Input vector is not valid.");
      } else if (
        typeof stored_vector == "undefined" ||
        stored_vector == null ||
        stored_vector == ""
      ) {
        console.error("Stored vector is not valid.");
      } else {
        result = cosineSimilarity(input_vector, stored_vector);
      }

      msg.payload = String(result);
      this.send(msg);
    });
  }
  RED.nodes.registerType("calculate-cosine", CalculateCosine);
};
