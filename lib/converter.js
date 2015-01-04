var http      = require('http'),
    url       = require('url'),
    crypto    = require('crypto'),
    fs        = require('fs'),
    utils     = require('./modules/utils'),
    constants = require('./constants'),
    async     = require('async');

module.exports = {
  convert:convert
};

function convert(unparsedUrl, format, callback) {
  callback = callback || function(){};
  var parsedUrl = url.parse(unparsedUrl),
      options = {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        headers: {}
      },
      mime,
      css = '';

  switch (format) {
    // Google Fonts need a User-Agent header to give the right format back.
    case 'woff':
      options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0';
      mime = 'application/font-woff'; // http://dev.w3.org/webfonts/WOFF/spec/#appendix-b
      break;
    case 'woff2':
      options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
      mime = 'application/font-woff2'; // http://dev.w3.org/webfonts/WOFF2/spec/#IMT
      break;
  }

  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      css += chunk;
    });
    res.on('end', function() {
      var urls = utils.extractRegExp(css, constants.urlFormat);
      if( urls.length == 0 ){
        return callback(new Error('invalid url'),null);
      }
      var encodingQueue = urls.map(encodeUrlContent);
      async.parallel(encodingQueue,function(err,results){
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          css = replaceWithUrlEncodedContent(css, result.url, result.encodedContent, mime);
        };

        var json = {
          md5: crypto.createHash('md5').update(css).digest('hex'),
          value: css
        };
        callback(null,json);
      })
    })
  });
}
function encodeUrlContent(url){
  return function(done) {
    http.get(url, function(res) {
      var data = [];
      res.on('data', function(chunk) {
        data.push(chunk);
      });
      res.on('end', function() {
        var encodedContent = Buffer.concat(data).toString('base64');
        done(null,{
          url: url,
          encodedContent: encodedContent,
          contentType: res.headers['content-type']
        });
      });
    });
  }
}

function replaceWithUrlEncodedContent(css, url, encodedContent, mime){
  return css.replace(url, 'data:' + mime + ';base64,' + encodedContent);
}
