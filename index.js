const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// top level code execute once
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'));
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}

const server = http.createServer((request, response) => {
    const fullUrl = url.parse('http://localhost' + request.url);
    const query = querystring.parse(fullUrl.query);
    const pathName = fullUrl.pathname;

    if (pathName === '/' || pathName === '/overview') {
        const cardsHTML = data.map((product) => replaceTemplate(tempCard, product)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML)
        response.end(output);
    } else if (pathName === '/products') {
        const product = data[query.id];
        const output = replaceTemplate(tempProduct, product);

        response.end(output);
    } else if (pathName === '/api/products') {
        //__dirname: where the current file is located
        // .: where the current file executed

        response.writeHead(200, {
            'Content-type': 'application/json'
        });

        response.end(JSON.stringify(data));

    } else {
        response.writeHead(404, {
            'Content-type': 'text/html'
        });
        response.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, 'localhost', () => {
    console.log('Listening to requests on port 8000');
});