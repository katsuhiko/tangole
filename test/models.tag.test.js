var should = require('should');
require('../db-connect.js');
require('../app/models/tag');

describe('Tag', function() {
  var Tag = mongoose.model('Tag');

  after(function(done) {
    Tag.remove({}, function(err) {
      done();
    });
  });

  describe('#save', function() {
    it('登録できること', function(done) {
      var tag = new Tag();
      tag.words.push('test');
      tag.words.push('node');

      tag.save(function(err) {
        should.not.exist(err);
        Tag.findById(tag._id, function(err, doc) {
          should.not.exist(err);
          doc.weight.valueOf().should.equal(10);
          doc.words.should.have.length(2);
          doc.words[0].should.equal('test');
          doc.words[1].should.equal('node');
          done();
        });
      });
    });
  });

});