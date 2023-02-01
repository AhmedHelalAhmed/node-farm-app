const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;
const PORT_NUMBER = 8000;
const HOSTNAME = 'localhost';


// top level code execute once
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'));
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateProductAttributes = {
    "id": /{%ID%}/g,
    "productName": /{%PRODUCTNAME%}/g,
    "image": /{%IMAGE%}/g,
    "from": /{%FROM%}/g,
    "nutrients": /{%NUTRIENTS%}/g,
    "quantity": /{%QUANTITY%}/g,
    "price": /{%PRICE%}/g,
    "description": /{%DESCRIPTION%}/g
};


const replaceTemplate = (temp, product) => {
    let output = temp;
    for (const attribute in templateProductAttributes) {
        output = output.replace(templateProductAttributes[attribute], product[attribute])
    }

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

        response.writeHead(HTTP_OK, {
            'Content-type': 'application/json'
        });

        response.end(JSON.stringify(data));

    } else {
        response.writeHead(HTTP_NOT_FOUND, {
            'Content-type': 'text/html'
        });
        response.end('<h1>Page not found!</h1>');
    }
});

server.listen(PORT_NUMBER, HOSTNAME, () => {
    console.log(`Listening on ${HOSTNAME} to requests on port ${PORT_NUMBER}`);
});