var expect    = require('chai').expect,
    utils     = require('../../lib/modules/utils'),
    constants = require('../../lib/constants');

var complexCss =
      '@font-face {\n\
        font-family: \'Dosis\';\n\
        font-style: normal;\n\
        font-weight: 400;\n\
        src: local(\'Dosis Regular\'), url(http://fonts.gstatic.com/400.woff2) format(\'woff2\'), url(http://fonts.gstatic.com/400.woff) format(\'woff\');\n\
      }\n\
      @font-face {\n\
        font-family: \'Dosis\';\n\
        font-style: normal;\n\
        font-weight: 600;\n\
        src: local(\'Dosis SemiBold\'), url(http://fonts.gstatic.com/600.woff2) format(\'woff2\'), url(http://fonts.gstatic.com/600.woff) format(\'woff\');\n\
      }\n',
    minifiedCssWoff = '@font-face{font-family:\'Dosis\';font-weight:400;src:url(http://fonts.gstatic.com/400.woff) format(\'woff\')}@font-face{font-family:\'Dosis\';font-weight:600;src:url(http://fonts.gstatic.com/600.woff) format(\'woff\')}',
    minifiedCssWoff2 = '@font-face{font-family:\'Dosis\';font-weight:400;src:url(http://fonts.gstatic.com/400.woff2) format(\'woff2\')}@font-face{font-family:\'Dosis\';font-weight:600;src:url(http://fonts.gstatic.com/600.woff2) format(\'woff2\')}',
    url = 'http://google.com',
    cssStringNoQuotes     = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url('   + url +   ')',
    cssStringSingleQuotes = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url(\'' + url + '\')',
    cssStringDoubleQuotes = '@font-face {font-family: \'Dosis\';src: local(\'Dosis Regular\'), local(\'Dosis-Regular\'), url("'  + url +  '")';

describe('utils', function() {
  describe('minifyCss', function() {
    it('should minify a css string keeping only woff', function () {
      var minifiedCss = utils.minifyCss(complexCss, 'woff');
      expect(minifiedCss).to.equal(minifiedCssWoff);
    });
    it('should minify a css string keeping only woff2', function () {
      var minifiedCss = utils.minifyCss(complexCss, 'woff2');
      expect(minifiedCss).to.equal(minifiedCssWoff2);
    });
  });

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
