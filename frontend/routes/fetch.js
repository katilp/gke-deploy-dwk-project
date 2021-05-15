const fs = require('fs');
const fetch = require('node-fetch');
path = require('path')

const url = "https://picsum.photos/1200 "

async function download() {
  const response = await fetch(url);
  const buffer = await response.buffer();
  var filePath = path.join(__dirname, '..', 'shared', 'image.jpg');
  console.log(filePath);
  fs.writeFile(filePath, buffer, () =>
    console.log('finished downloading!'));
}

module.exports.download = download;