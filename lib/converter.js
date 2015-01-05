var http      = require('http'),
    url       = require('url'),
    crypto    = require('crypto'),
    fs        = require('fs'),
    async     = require('async'),
    utils     = require('./modules/utils'),
    constants = require('./constants');

module.exports = {
  convert: convert
};

function convert(unparsedUrl, format, callback) {
  callback = callback || function() {};

  var parsedUrl = url.parse(unparsedUrl, true),
      options = {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        headers: {
          'User-Agent': constants[format].userAgent
        }
      },
      css = '';

  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      css += chunk;
    });
    res.on('end', function() {
      if (format === 'woff2') {
        // Browsers that support WOFF2 also support unicode-range, Google Fonts
        // makes use of this and serves all available subsets. We are only
        // interested in the actual requested subsets.
        var subset = getSubset(parsedUrl.query);
        css = css.replace(/\/\*\s*([\w-]+)\s*\*\/[^}]+}\n?/g, function(match, chars) {
          if (~subset.indexOf(chars)) {
            return match;
          }
          return '';
        });
      }

      var urls = utils.extractRegExp(css, constants.urlFormat);
      if (urls.length == 0) {
        callback(new Error('invalid url'));
        return;
      }

      var encodingQueue = urls.map(encodeUrlContent);
      async.parallel(encodingQueue, function(err,results) {
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          css = replaceWithUrlEncodedContent(css, result.url, result.encodedContent, constants[format].contentType);
        };

        var json = {
          md5: crypto.createHash('md5').update(css).digest('hex'),
          value: css
        };
        callback(null, json);
      })
    })
  });
}

function getSubset(query) {
  var subset = query.subset || 'latin';
  return subset.split(',');
}

function encodeUrlContent(url) {
  return function(done) {
    http.get(url, function(res) {
      var data = [];
      res.on('data', function(chunk) {
        data.push(chunk);
      });
      res.on('end', function() {
        var encodedContent = Buffer.concat(data).toString('base64');
        done(null, {
          url: url,
          encodedContent: encodedContent,
          contentType: res.headers['content-type']
        });
      });
    });
  }
}

function replaceWithUrlEncodedContent(css, url, encodedContent, contentType) {
  return css.replace(url, 'data:' + contentType + ';base64,' + encodedContent);
}
