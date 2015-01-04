var fontStore = require('../../lib/fontStore');
var expect = require('chai').expect

var fs = require('fs');

var createdFile,
    options = {
      format: 'woff'
    };

describe('fontStore', function () {
  it('should generate a file called ... for the font Dosis', function (done) {
    fontStore('http://fonts.googleapis.com/css?family=Dosis', options, function(err,fileName,json){
      var fileExists = fs.existsSync(fileName)
      expect(fileExists).to.be.true;
      createdFile=fileName;
      done();
    });
  });

  afterEach(function() {
    if( createdFile )
      fs.unlink(createdFile)
    createdFile=null;
  });

});
