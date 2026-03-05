module.exports = function (RED) {
  'use strict';
  const mustache = require('mustache');

  function NodeContext(msg, nodeContext, parent) {
    this.msgContext = new mustache.Context(msg, parent);
    this.nodeContext = nodeContext;
  }

  NodeContext.prototype = new mustache.Context();

  NodeContext.prototype.lookup = function (name) {
    // try message first:
    try {
      const value = this.msgContext.lookup(name);
      if (value !== undefined) {
        return value;
      }

      // try node context:
      const dot = name.indexOf('.');
      if (dot > 0) {
        const contextName = name.substr(0, dot);
        const variableName = name.substr(dot + 1);

        if (contextName === 'flow' && this.nodeContext.flow) {
          return this.nodeContext.flow.get(variableName);
        } else if (contextName === 'global' && this.nodeContext.global) {
          return this.nodeContext.global.get(variableName);
        }
      }
      return undefined;
    } catch (err) {
      throw err;
    }
  };

  NodeContext.prototype.push = function push(view) {
    return new NodeContext(view, this.nodeContext, this.msgContext);
  };

  function GoogleAIConfig(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
  }

  RED.nodes.registerType('googleai-config', GoogleAIConfig, {
    credentials: {
      secretKey: { type: 'password', required: true },
    },
  });

  function GoogleAINode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.name = n.name;
    node.field = n.field || 'payload';
    node.fieldType = n.fieldType || 'msg';
    node.modelId = n.modelId;
    node.mode = n.mode;
    node.params = n.params;
    node.configId = n.config;
    node.stConfigId = n.stConfig;

    node.chatSession = null;
    node.on('input', async function (msg) {
      function sendToNode(value) {
        let formattedValue = (typeof value === 'string') ? value : JSON.stringify(value);

        if (node.fieldType === 'msg') {
          RED.util.setMessageProperty(msg, node.field, formattedValue);
        } else if (node.fieldType === 'flow') {
          node.context().flow.set(node.field, formattedValue);
        } else if (node.fieldType === 'global') {
          node.context().global.set(node.field, formattedValue);
        }

        node.status({});
        node.send(msg);
      }

      node.config = RED.nodes.getNode(node.configId);
      if (!node.config) {
        node.error('failed: Invalid GoogleAI credentials');
        return;
      }

      try {
        let value;
        let usage;
        const { GoogleGenAI } = require("@google/genai");
        const ai = new GoogleGenAI({ apiKey: node.config.credentials.secretKey });
        const paramValue = mustache.render(node.params, new NodeContext(msg, node.context()));

        const isChat = node.mode === 'chat';

        try {
          if (isChat) {
            if (!node.chatSession) {
              node.chatSession = await ai.chats.create({
                model: node.modelId,
                history: []
              });
              node.log("New Chat Session Created");
            }
            const response = await node.chatSession.sendMessage({
              message: paramValue,
            });
            value = response.text;
            usage = response.usageMetadata;

            let history = await node.chatSession.getHistory();
            const MAX_HISTORY = 10;
            if (history.length > MAX_HISTORY) {
              history = history.slice(-MAX_HISTORY);
              node.chatSession = await ai.chats.create({
                model: node.modelId,
                history: history
              });
            }
          } else {
            const response = await ai.models.generateContent({
              model: node.modelId,
              contents: paramValue,
            });
            value = response.text;
            usage = response.usageMetadata;
          }

          node.status({
            fill: "blue",
            shape: "dot",
            text: `Free Tier | Tokens: ${usage.totalTokenCount}`
          });

          sendToNode(value);

        } catch (error) {
          node.chatSession = null;
          node.error(`[Gemini Error] ${error.message}`);
          node.status({ fill: "red", shape: "ring", text: "Error" });
        }
      } catch (e) {
        console.log("e : ", e);
        node.status({ fill: 'red', shape: 'dot', text: 'error' });
        node.error(e);
      }
    });
  }

  RED.nodes.registerType('googleai-generate', GoogleAINode);
}