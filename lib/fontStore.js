var fs = require('fs');
var converter = require('./converter');

module.exports = function(url, callback){
  converter.convert(url, conversionCallback);

  function conversionCallback(err,json){
    if( err ){
      callback(err,null);
    }
    var filename = 'fonts.' + json.md5 + '.woff.json';
    fs.writeFile(filename, JSON.stringify(json), function(err) {
      callback(err,filename,json);
    });
  }
};