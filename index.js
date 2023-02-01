const http = require('http');
const url = require('url');
const querystring = require('querystring');

const httpCode = require('./modules/httpCode');
const config = require('./modules/config');
const replaceTemplate = require('./modules/replaceTemplate');

// top level code execute once
const data = require('./modules/loadData');
const views = require('./modules/loadViews');

const server = http.createServer((request, response) => {
  const fullUrl = url.parse(`http://${config.HOSTNAME}${request.url}`);
  const query = querystring.parse(fullUrl.query);
  const pathName = fullUrl.pathname;

  if (pathName === '/' || pathName === '/overview') {
    const cardsHTML = data
      .map((product) => replaceTemplate(views.cardTemplate, product))
      .join('');
    const output = views.overviewTemplate.replace(
      /{%PRODUCT_CARDS%}/g,
      cardsHTML
    );
    response.end(output);
  } else if (pathName === '/products') {
    const product = data[query.id];
    const output = replaceTemplate(views.productTemplate, product);

    response.end(output);
  } else if (pathName === '/api/products') {
    //__dirname: where the current file is located
    // .: where the current file executed

    response.writeHead(httpCode.HTTP_OK, {
      'Content-type': 'application/json',
    });

    response.end(JSON.stringify(data));
  } else {
    response.writeHead(httpCode.HTTP_NOT_FOUND, {
      'Content-type': 'text/html',
    });
    response.end('<h1>Page not found!</h1>');
  }
});

server.listen(config.PORT_NUMBER, config.HOSTNAME, () => {
  console.log(
    `Listening on ${config.HOSTNAME} to requests on port ${config.PORT_NUMBER}`
  );
});
