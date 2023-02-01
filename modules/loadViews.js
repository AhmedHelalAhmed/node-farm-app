const fs = require('fs');

const overviewTemplate = (() =>
  fs.readFileSync(
    `${__dirname}/../templates/template-overview.html`,
    'utf-8'
  ))();

const cardTemplate = (() =>
  fs.readFileSync(`${__dirname}/../templates/template-card.html`, 'utf-8'))();

const productTemplate = (() =>
  fs.readFileSync(
    `${__dirname}/../templates/template-product.html`,
    'utf-8'
  ))();

module.exports = {
  overviewTemplate,
  cardTemplate,
  productTemplate,
};
