var expect = require('chai').expect
var fs = require('fs');

var converter = require('../../lib/converter');
var dosisJson = require('../fonts-fixtures/Dosis.json');

var createdFile;

describe('converter', function () {
  describe('conversion of font Dosis', function () {
    it('should match the md5 sum', function (done) {
      converter.convert('http://fonts.googleapis.com/css?family=Dosis', function(err,fontJson){
        createdFile=fontJson.md5;
        expect(fontJson.md5).to.equal(dosisJson.md5);
        done();
      });
    });
    it('should match the converted font', function (done) {
      converter.convert('http://fonts.googleapis.com/css?family=Dosis', function(err,fontJson){
        createdFile=fontJson.md5;
        expect(fontJson.value).to.equal(dosisJson.value);
        done();
      });
    });
  });

  describe('conversion of invalid font', function () {
    it('should fail', function (done) {
      converter.convert('http://fonts.googleapis.com/css?family=Unexisting font', function(err,fontJson){
        expect(err).not.to.be.null;
        done();
      });
    });    
  });

  afterEach(function() {
    if( createdFile ){
      fs.unlink('fonts.'+createdFile+'.woff.json', function (err) {
        if( err && err.code !== 'ENOENT' ) console.log( err );
      });
    }
    createdFile=null;
  });
});