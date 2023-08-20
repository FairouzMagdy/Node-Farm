const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const jsonData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productObj = JSON.parse(jsonData);

//const slugs = productObj.map((el) => slugify(el.productName, { lower: true }));
productObj.forEach(el => (el.slug = slugify(el.productName, { lower: true })));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const cardHtml = productObj
      .map(el => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%CARD%}', cardHtml);
    res.end(output);

    // product
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = productObj.find(el => el.slug === query.id);
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'Application/json' });
    res.end(jsonData);

    // Not Found
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'roza',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
