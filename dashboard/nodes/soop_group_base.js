module.exports = function (RED) {
  RED.httpAdmin.get("/group_table/static/*", function (req, res) {
    var options = {
      root: __dirname + "/static/",
      dotfiles: "deny",
    };
    res.sendFile(req.params[0], options);
  });
};
