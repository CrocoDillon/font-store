var expect = require('chai').expect
var fontStore = require('../../lib/');
var dosisJson = require('../fonts-fixtures/Dosis.json');

describe('font-store', function () {
  it('should convert the font Dosis to json', function (done) {
    fontStore('http://fonts.googleapis.com/css?family=Dosis', function(err,fontJson){
      expect(fontJson.md5).to.equal(dosisJson.md5);
      done();
    });
  });
});