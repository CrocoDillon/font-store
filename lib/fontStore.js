var fs = require('fs');
var converter = require('./converter');

module.exports = function(url, callback){
  converter.convert(url, conversionCallback);

  function conversionCallback(json){
    var filename = 'fonts.' + json.md5 + '.woff.json';
    fs.writeFile(filename, JSON.stringify(json), function(err) {
      callback(err,filename,json);
    });
  }
};