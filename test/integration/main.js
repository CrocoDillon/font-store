var expect = require('chai').expect
var fs = require('fs');

var fontStore = require('../../lib/');
var dosisJson = require('../fonts-fixtures/Dosis.json');

var createdFile;

describe('font-store', function () {
  it('should convert the font Dosis to json', function (done) {
    fontStore('http://fonts.googleapis.com/css?family=Dosis', function(fontJson){
      createdFile=fontJson.md5;
      expect(fontJson.md5).to.equal(dosisJson.md5);
      done();
    });
  });

  afterEach(function() {
    if( createdFile ){
      fs.unlink('fonts.'+createdFile+'.woff.json', function (err) {
        if( err ) console.log( err );
      });
    }
    createdFile=null;
  });
});