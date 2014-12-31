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
      css = '',
      base64 = {};

  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      css += chunk;
    });
    res.on('end', function() {
      var urls = utils.extractRegExp(css, constants.urlFormat);
      var urlsToFetch = urls.map(function(url){
        return function(done) {
          http.get(url, function(res) {
            var data = [];
            res.on('data', function(chunk) {
              data.push(chunk);
            });
            res.on('end', function() {
              data = Buffer.concat(data);
              base64[url] = data.toString('base64');
              done();
            });
          });
        }
      });
      async.parallel(urlsToFetch,function(){
        css = replaceWithBase64EncodedContent(css,base64);
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

function replaceWithBase64EncodedContent(css,base64){
  return css.replace(constants.urlFormat, function(match, url) {
    return 'url(data:application/x-font-woff;base64,' + base64[url] + ')';
  });
}

module.exports = convert;
