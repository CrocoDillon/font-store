var http      = require('http'),
    url       = require('url'),
    crypto    = require('crypto'),
    fs        = require('fs'),
    utils     = require('./modules/utils'),
    constants = require('./constants'),
    async     = require('async');

function convert(unparsedUrl,callback) {
  callback = callback || function(){};
  var parsedUrl = url.parse(unparsedUrl),
      options = {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        headers: {
          // Need a header to get WOFF back
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
        }
      },
      css = '';

  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      css += chunk;
    });
    res.on('end', function() {
      var urls = utils.extractRegExp(css, constants.urlFormat);
      var encodingQueue = urls.map(encodeUrlContent);
      async.parallel(encodingQueue,function(err,results){
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          css = replaceWithUrlEncodedContent(css,result.url,result.encodedContent);
        };

        var json = {
          md5: crypto.createHash('md5').update(css).digest('hex'),
          value: css
        };
        fs.writeFile('fonts.' + json.md5 + '.woff.json', JSON.stringify(json), function(err) {
          if (err) {
            console.log(err);
            callback(err,null);
          } else {
            console.log('Done!')
            callback(null, json);
          }
        });
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
          url:url,
          encodedContent:encodedContent
        });
      });
    });
  }
}

function replaceWithUrlEncodedContent(css,url,encodedContent){
  return css.replace(url,'data:application/x-font-woff;base64,' + encodedContent);
}

module.exports = convert;