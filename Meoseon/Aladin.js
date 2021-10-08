module.exports = function (RED) {
	'use strict';
	const axios = require('axios');
	const defaultErrorMessageKOKR = '요청에서 에러를 확인했습니다.'
	const ALADIN_API_BASE_URL = 'http://www.aladin.co.kr/ttb/api/'
	function AladinNode(config) {
		RED.nodes.createNode(this, config);

		const node = this;
		this.name = config.name;
		
		const temp = {
			TTBKey: RED.nodes.getNode(config.creds).credentials.TTBKey || '',
			QueryType: config.RequestType === 'ItemSearch' ? config.QueryType1 : config.QueryType2
		}
		node.params = Object.assign({}, config, temp)
		
		node.on('input', (msg, send, done) => {
			node.params = Object.assign(node.params, msg)
			
			if (node.params.RequestType === 'ItemSearch') {
				node.params['QueryType'] = msg.QueryType || msg.QueryType1 || node.params['QueryType'];
			} else {
				node.params['QueryType'] = msg.QueryType || msg.QueryType2 || node.params['QueryType'];
			}
			
			msg.params = node.params;

			if (config.RequestType === 'ItemSearch') {
				// console.log('This is:', config.RequestType);
				axios
					.get(ALADIN_API_BASE_URL+'ItemSearch.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(defaultErrorMessageKOKR);
					});
			} else if (config.RequestType === 'ItemList') {
				axios
					.get(ALADIN_API_BASE_URL+'ItemList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(defaultErrorMessageKOKR);
					});
			} else if (config.RequestType === 'ItemLookUp') {
				axios
					.get(ALADIN_API_BASE_URL+'ItemLookUp.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(defaultErrorMessageKOKR);
					});
			} else if (config.RequestType === 'ItemOffStoreList') {
				axios
					.get(ALADIN_API_BASE_URL+'ItemOffStoreList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(defaultErrorMessageKOKR);
					});
			} else {
				if (done) {
					done('RequestType 넷 중 하나는 선택하세요');
				} else {
					node.error('RequestType 넷 중 하나는 선택하세요', msg);
				}
			}
		});
	}
	RED.nodes.registerType('aladin', AladinNode);

	function AladinTTBKeyNode(config) {
		RED.nodes.createNode(this, config);
		this.name = config.name;
		this.TTBKey = config.TTBKey;
	}

	RED.nodes.registerType('aladinTTBKey', AladinTTBKeyNode, {
		credentials: {
			TTBKey: { type: 'text' },
		},
	});
};
