module.exports = function (RED) {
  function ChromaDBNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const { ChromaClient } = require("chromadb");
    const chroma = new ChromaClient({
      path: config.dbIp + ":" + config.dbPort,
    });

    async function execute(msg) {
      if (config.operation == "insert") {
        const collection = await chroma.getOrCreateCollection({
          name: config.dbName,
          metadata: {
            "hnsw:space": "cosine",
          },
        });

        const count = (await collection.count()) + 1;
        await collection.add({
          ids: ["face-id-" + count],
          embeddings: msg.payload,
        });

        msg.payload = "Insert success";
      } else {
        const collection = await chroma.getCollection({
          name: config.dbName,
        });

        const queryData = await collection.query({
          queryEmbeddings: msg.payload,
          nResults: 1,
        });

        console.log(queryData);
        msg.payload = queryData.distances;
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
