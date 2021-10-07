module.exports = function (RED) {
	'use strict';
	const axios = require('axios');
	const ERROR_MESSAGE = "알라딘 노드 에러 입니다. request 에서 에러를 확인하세요"
	function AladinNode(config) {
		RED.nodes.createNode(this, config);

		const node = this;
		this.name = config.name;
		node.RequestType = config.RequestType;

		node.params = {};
		node.params['TTBKey'] =
			RED.nodes.getNode(config.creds).credentials.TTBKey || '';
		node.params['Query'] = config.Query;
		node.params['RequestType'] = config.RequestType;
		if (node.params.RequestType === 'ItemSearch') {
			node.params['QueryType'] = config.QueryType1;
		} else {
			node.params['QueryType'] = config.QueryType2;
		}
		node.params['SearchTarget'] = config.SearchTarget;
		node.params['SubSearchTarget'] = config.SubSearchTarget;
		node.params['ItemId'] = config.ItemId;
		node.params['ItemIdType'] = config.ItemIdType;
		node.params['Start'] = config.Start;
		node.params['MaxResults'] = config.MaxResults;
		node.params['Sort'] = config.Sort;
		node.params['Cover'] = config.Cover;
		node.params['CategoryId'] = config.CategoryId;
		node.params['Output'] = config.Output;
		node.params['Partner'] = config.Partner;
		node.params['includeKey'] = config.includeKey;
		node.params['InputEncoding'] = config.InputEncoding;
		node.params['Version'] = config.Version;
		node.params['outofStockfilter'] = config.outofStockfilter;
		node.params['offCode'] = config.offCode;
		node.params['OptResult'] = config.OptResult;

		node.on('input', (msg, send, done) => {
			node.params['TTBKey'] = msg.TTBKey || node.params['TTBKey'];
			node.params['Query'] = msg.Query || node.params['Query'];
			node.params['RequestType'] =
				msg.RequestType || node.params['RequestType'];
			if (node.params.RequestType === 'ItemSearch') {
				node.params['QueryType'] = msg.QueryType1 || node.params['QueryType'];
			} else {
				node.params['QueryType'] = msg.QueryType2 || node.params['QueryType'];
			}
			node.params['SearchTarget'] =msg.SearchTarget || node.params['SearchTarget'];
			node.params['SubSearchTarget'] =msg.SubSearchTarget || node.params['SubSearchTarget'];
			node.params['ItemId'] = msg.ItemId || node.params['ItemId'];
			node.params['ItemIdType'] = msg.ItemIdType || node.params['ItemIdType'];
			node.params['Start'] = msg.Start || node.params['Start'];
			node.params['MaxResults'] = msg.MaxResults || node.params['MaxResults'];
			node.params['Sort'] = msg.Sort || node.params['Sort'];
			node.params['Cover'] = msg.Cover || node.params['Cover'];
			node.params['CategoryId'] = msg.CategoryId || node.params['CategoryId'];
			node.params['Output'] = msg.Output || node.params['Output'];
			node.params['Partner'] = msg.Partner || node.params['Partner'];
			node.params['includeKey'] = msg.includeKey || node.params['includeKey'];
			node.params['InputEncoding'] =
				msg.InputEncoding || node.params['InputEncoding'];
			node.params['Version'] = msg.Version || node.params['Version'];
			node.params['outofStockfilter'] =
				msg.outofStockfilter || node.params['outofStockfilter'];
			node.params['offCode'] = msg.offCode || node.params['offCode'];
			node.params['OptResult'] = msg.OptResult || node.params['OptResult'];

			msg.params = node.params;

			if (config.RequestType === 'ItemSearch') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(ERROR_MESSAGE, error);
					});
			} else if (config.RequestType === 'ItemList') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(ERROR_MESSAGE, error);
					});
			} else if (config.RequestType === 'ItemLookUp') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(ERROR_MESSAGE, error);
					});
			} else if (config.RequestType === 'ItemOffStoreList') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemOffStoreList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error(ERROR_MESSAGE, error);
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
