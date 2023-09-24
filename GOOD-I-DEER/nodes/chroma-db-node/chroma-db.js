module.exports = function (RED) {
  function ChromaDBNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const { ChromaClient } = require("chromadb");
    const chroma = new ChromaClient({
      path: config.dbIp + ":" + config.dbPort,
    });

    async function execute(msg) {
      switch (config.operation) {
        case "list":
          msg.payload = await chroma.listCollections();
          break;
        case "create":
          msg.payload = await chroma.getOrCreateCollection({
            name: config.dbName,
            metadata: {
              "hnsw:space": config.distance,
            },
          });
          break;
        case "insert":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          const count = (await collection.count()) + 1;
          await collection.add({
            ids: ["face-id-" + count],
            embeddings: Array.from(msg.payload),
          });
          break;
        case "query":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          const queryData = await collection.query({
            queryEmbeddings: Array.from(msg.payload),
            nResults: config.nResults,
          });

          msg.payload = queryData.distances[0];
          break;
        case "delete":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          msg.payload = await collection.delete({
            ids: config.ids,
          });
          break;
        case "drop":
          msg.payload = await chroma.deleteCollection({
            name: config.dbName,
          });
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
