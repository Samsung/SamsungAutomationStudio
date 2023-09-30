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
          var collection = await chroma.getOrCreateCollection({
            name: config.dbName,
            metadata: {
              "hnsw:space": config.distance,
            },
          });

          msg.result = "Collection successfully created";
          break;
        case "insert":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          const embeddings = Array.from(msg.payload);

          const count = (await collection.count()) + 1;

          var len = 1;
          if (Array.isArray(embeddings[0])) {
            len = embeddings.length;
          }

          var ids = [];
          for (var i = 0; i < len; i++) {
            ids.push("id-" + (count + i));
          }

          await collection.add({
            ids: ids,
            embeddings: embeddings,
          });

          msg.result = ids;
          break;
        case "query":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          msg.payload = await collection.query({
            queryEmbeddings: Array.from(msg.payload),
            nResults: config.nResults,
          });
          break;
        case "delete":
          var collection = await chroma.getCollection({
            name: config.dbName,
          });

          msg.payload = await collection.delete({
            ids: Array.from(msg.payload),
          });
          break;
        case "drop":
          msg.payload = await chroma.deleteCollection({
            name: config.dbName,
          });

          msg.result = "Collection successfully droped";
          break;
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
  RED.nodes.registerType("good-chroma-db", ChromaDBNode);
};
