module.exports = function (RED) {
  const parser = require('fast-xml-parser');
  const he = require('he');

  function ShoppingFilter(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', function (msg) {
      if (config.apiType === 'naver') {
        if (config.format === 'xml') {
          var options = {
            attributeNamePrefix: '@_',
            attrNodeName: 'attr', //default is 'false'
            textNodeName: '#text',
            ignoreAttributes: true,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: '__cdata', //default is 'false'
            cdataPositionChar: '\\c',
            parseTrueNumberOnly: false,
            arrayMode: false, //"strict"
            attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }), //default is a=>a
            tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
            stopNodes: ['parse-me-as-string'],
          };

          var jsonObj = parser.parse(msg.payload, options);
          msg.payload = jsonObj;
          msg.payload.items = msg.payload.rss.channel.item;
        }
        var list = msg.payload.items;

        if (config.minprice)
          list = list.filter((item) => Number(item.lprice) > Number(config.minprice));

        if (config.maxprice)
          list = list.filter((item) => Number(item.lprice) < Number(config.maxprice));

        if (config.sorttype === 'asc') list.sort(naverAscSort);
        else list.sort(naverDescSort);
        msg.payload.items = list;
      } else if (config.apiType === '11st') {
        var list = msg.payload.ProductSearchResponse.Products.Product;

        if (Array.isArray(list)) {
          if (config.minprice)
            list = list.filter((item) => Number(item.SalePrice._text) > Number(config.minprice));

          if (config.maxprice)
            list = list.filter((item) => Number(item.SalePrice._text) < Number(config.maxprice));

          if (config.sorttype === 'asc') list.sort(elevenAscSort);
          else list.sort(elevenDescSort);
        }

        msg.payload.ProductSearchResponse.Products.Product = list;
      }

      node.send(msg);
    });
  }

  function ShoppingFormatter(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var extractHtmlPattern = /(<([^>]+)>)/gi;

    node.on('input', function (msg) {
      var list = [];
      if (config.apiType === 'naver') {
        var products = msg.payload.items;
        products.forEach(function (product, idx) {
          var item = {
            productName: '',
            price: '',
            image: '',
            mall: '',
            link: '',
          };
          item.productName = product.title.replace(extractHtmlPattern, '');
          item.price = product.lprice;
          item.link = product.link;
          item.mall = product.mallName;
          item.image = product.image;
          list.push(item);
        });
      } else if (config.apiType === '11st') {
        var products = msg.payload.ProductSearchResponse.Products.Product;
        if (!Array.isArray(products)) {
          products = [products];
        }
        products.forEach(function (product, idx) {
          var item = {
            productName: '',
            price: '',
            image: '',
            mall: '',
            link: '',
          };
          item.productName = product.ProductName._cdata.replace(extractHtmlPattern, '');
          item.price = product.SalePrice._text;
          item.link = product.DetailPageUrl._cdata;
          item.mall = '11st';
          item.image = product.ProductImage300._cdata;
          list.push(item);
        });
      }

      msg.payload.items = list;
      node.send(msg);
    });
  }
  RED.nodes.registerType('shopping-filter', ShoppingFilter);
  RED.nodes.registerType('shopping-formatter', ShoppingFormatter);

  function naverAscSort(a, b) {
    var aprice = Number(a.lprice);
    var bprice = Number(b.lprice);
    if (aprice == bprice) return 0;
    return aprice > bprice ? 1 : -1;
  }

  function naverDescSort(a, b) {
    var aprice = Number(a.lprice);
    var bprice = Number(b.lprice);
    if (aprice == bprice) return 0;
    return aprice < bprice ? 1 : -1;
  }

  function elevenAscSort(a, b) {
    var aprice = Number(a.SalePrice._text);
    var bprice = Number(b.SalePrice._text);
    if (aprice == bprice) return 0;
    return aprice > bprice ? 1 : -1;
  }

  function elevenDescSort(a, b) {
    var aprice = Number(a.SalePrice._text);
    var bprice = Number(b.SalePrice._text);
    if (aprice == bprice) return 0;
    return aprice < bprice ? 1 : -1;
  }
};
