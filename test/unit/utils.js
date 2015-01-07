var expect    = require('chai').expect,
    utils     = require('../../lib/modules/utils'),
    constants = require('../../lib/constants');

var url = 'http://google.com',
    cssStringNoQuotes     = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url('   + url +   ')',
    cssStringSingleQuotes = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url(\'' + url + '\')',
    cssStringDoubleQuotes = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url("'  + url +  '")';

describe('utils', function() {
  describe('extractRegExp', function() {
    it('should extract urls found in a css string', function () {
      var extractedUrls = utils.extractRegExp(cssStringNoQuotes, constants.urlFormat);
      expect(extractedUrls).to.deep.equal([url]);
    });
    it('should also work with single quotes', function () {
      var extractedUrls = utils.extractRegExp(cssStringSingleQuotes, constants.urlFormat);
      expect(extractedUrls).to.deep.equal([url]);
    });
    it('should also work with double quotes', function () {
      var extractedUrls = utils.extractRegExp(cssStringDoubleQuotes, constants.urlFormat);
      expect(extractedUrls).to.deep.equal([url]);
    });
  });

  describe('replaceWithUrlEncodedContent', function() {
    it('should replace urls with base64 encoded content', function () {
      var result = utils.replaceWithUrlEncodedContent(cssStringNoQuotes, url, 'BASE64DATA', 'CONTENTTYPE'),
          indexOfUrl  = result.indexOf(url),
          indexOfData = result.indexOf('BASE64DATA');
      expect(indexOfUrl).to.equal(-1);
      expect(indexOfData).to.not.equal(-1);
    });
  });
});
