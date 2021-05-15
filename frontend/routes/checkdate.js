const fs = require('fs');
path = require('path');
var nf = require('./fetch');



async function checkdate() {

  var filePath = path.join(__dirname, '..', 'shared', 'time.txt');
  // check if recorded date is from today or earlier
  // there must be a more intelligent way of doing this...
  var savedtime = fs.readFileSync(filePath);
  //var savedDate = new Date(fs.readFileSync(filePath,'utf8'));
  console.log('read time from the file and it is ' + savedtime)
  var d = new Date();
  var timenow = d.getTime();
  console.log('got a new time from the current time and it is ' + timenow)
  // set time between downloads to 10 min (600000 ms) for testing
  var diff = timenow - savedtime;
  if (diff > 600000) {
    savedtime = timenow;
    fs.writeFileSync(filePath, timenow.toString(), (err) => { if (err) throw err; });
    console.log('Older than diff, dowloading');
    nf.download();
  }
}

module.exports.checkdate = checkdate;