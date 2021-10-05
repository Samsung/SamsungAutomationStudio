module.exports = function (RED) {
	'use strict';
	const axios = require('axios');
	const NAVER_API_URL_XML = 'https://openapi.naver.com/v1/search/shop.xml';
	const NAVER_API_URL_JSON = 'https://openapi.naver.com/v1/search/shop.json';

	function naverBooksNode(config) {
		RED.nodes.createNode(this, config);
		const node = this;
		node.clientId = RED.nodes.getNode(config.creds).credentials.clientId;
		node.clientSecret = RED.nodes.getNode(config.creds).credentials.clientSecret;
		node.name = config.name;

		node.on('input', (msg) => {
			const queries = config.query.split(',');
			queries.forEach((item) => {
				node.url = config.returnType === 'json' ? NAVER_API_URL_JSON : NAVER_API_URL_XML;
				node.options = {
                    headers : {
                    'X-Naver-Client-Id':node.clientId,
                    'X-Naver-Client-Secret':node.clientSecret,
                    },
                    params : {
                    "query": item,
                    "display": config.display,
                    "start": config.start,
                    "sort": config.sort,
                    }
                };
								
				axios
					.get(node.url, node.options)
					.then((response) => {
						node.status({ fill: 'green', shape: 'dot', text: 'success' });
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.status({ fill: 'red', shape: 'dot', text: 'error' });
						msg.payload = error;
						node.send(msg);
					});
			});
		});
	}

	RED.nodes.registerType('naver-books', naverBooksNode, {
		credentials: {
			clientId: { type: 'text' },
			clientSecret: { type: 'text' },
		},
	});

	function naverBooksApiKey(n) {
		RED.nodes.createNode(this, n);
		this.clientId = n.clientId;
		this.clientSecret = n.clientSecret;
	}

	RED.nodes.registerType('naver-books-api-key', naverBooksApiKey, {
		credentials: {
			clientId: { type: 'text' },
			clientSecret: { type: 'text' },
		},
	});
};
