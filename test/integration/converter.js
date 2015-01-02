var expect = require('chai').expect
var fs = require('fs');

var converter = require('../../lib/converter');
var dosisJson = require('../fonts-fixtures/Dosis.json');

var createdFile;

describe('converter', function () {
  it('should convert the font Dosis to json', function (done) {
    converter.convert('http://fonts.googleapis.com/css?family=Dosis', function(fontJson){
      createdFile=fontJson.md5;
      expect(fontJson.md5).to.equal(dosisJson.md5);
      done();
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