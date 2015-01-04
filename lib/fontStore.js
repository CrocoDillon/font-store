var fs = require('fs');
var converter = require('./converter');

module.exports = function(url, options, callback) {
  converter.convert(url, options.format, conversionCallback);

  function conversionCallback(err,json){
    if( err ){
      callback(err);
      return;
    }
    var filename = ['fonts', json.md5, options.format, 'json'].join('.');
    fs.writeFile(filename, JSON.stringify(json), function(err) {
      callback(err,filename,json);
    });
  }
};
