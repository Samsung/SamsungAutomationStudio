module.exports = function (RED) {
  function ChromaDBNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const { ChromaClient } = require("chromadb");
    const chroma = new ChromaClient({
      path: config.dbIp + ":" + config.dbPort,
    });

    async function execute(msg) {
      if (config.operation == "create") {
        const collection = await chroma.getOrCreateCollection({
          name: config.dbName,
          metadata: {
            "hnsw:space": config.distance,
          },
        });
      } else if (config.operation == "insert") {
        const collection = await chroma.getCollection({
          name: config.dbName,
        });

        const count = (await collection.count()) + 1;
        await collection.add({
          ids: ["face-id-" + count],
          embeddings: Array.from(msg.payload),
        });
      } else if (config.operation == "query") {
        const collection = await chroma.getCollection({
          name: config.dbName,
        });

        const queryData = await collection.query({
          queryEmbeddings: Array.from(msg.payload),
          nResults: config.nResults,
        });

        msg.payload = queryData.distances[0];
      }
    }

    node.on("input", function (msg) {
      execute(msg)
        .catch((error) => console.error(error))
        .then(() => {
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("chroma-db", ChromaDBNode);
};
