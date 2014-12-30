var expect = require('chai').expect;
var utils = require('../../lib/modules/utils');

var url = 'http://google.com';
var cssString = "@font-face {font-family: 'Dosis';src: local('Dosis Regular'), local('Dosis-Regular'), url("+url+")";
describe('utils', function () {
  it('should extract urls found in a string', function () {
    var extractedUrls = utils.extractUrls(cssString);
    expect(extractedUrls).to.deep.equal([url]);
  });
});