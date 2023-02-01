const fs = require("fs");

module.exports = (() => JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`, 'utf-8')))();



