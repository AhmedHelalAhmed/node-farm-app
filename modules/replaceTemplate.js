const templateProductAttributes = {
  id: /{%ID%}/g,
  productName: /{%PRODUCTNAME%}/g,
  image: /{%IMAGE%}/g,
  from: /{%FROM%}/g,
  nutrients: /{%NUTRIENTS%}/g,
  quantity: /{%QUANTITY%}/g,
  price: /{%PRICE%}/g,
  description: /{%DESCRIPTION%}/g,
};

module.exports = (temp, product) => {
  let output = temp;

  for (const attribute in templateProductAttributes) {
    output = output.replace(
      templateProductAttributes[attribute],
      product[attribute]
    );
  }

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};
