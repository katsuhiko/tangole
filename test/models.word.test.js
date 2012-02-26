var should = require('should');
require('../db-connect.js');
require('../app/models/word');

describe('Word', function() {
  var Word = mongoose.model('Word'),
      data = {};

  before(function(done) {
    // テストデータの登録
    Word.create([
      { name: 'test1', word: 'coding1' }
    ], function(err) {
      done();
    });
  });

  beforeEach(function() {
    data = { name: 'testX', word: 'codingX' };
  });

  afterEach(function(done) {
    Word.remove({ name: 'testX' }, function(err) {
      done();
    });
  });

  after(function(done) {
    Word.remove({}, function(err) {
      done();
    });
  });

  describe('#saveIfNotExists', function() {
    it('異なる単語が登録できること', function(done) {
      var word = new Word(data);

      word.saveIfNotExists(function(err) {
        should.not.exist(err);
        Word.findById(word._id, function(err, doc) {
          should.not.exist(err);
          doc.name.should.equal('testX');
          doc.word.should.equal('codingX');
          done();
        });
      });
    });
    it ('重複した単語は登録できないこと', function(done) {
      var word = new Word({
        name: 'test1',
        word: 'coding1'
      });

      word.saveIfNotExists(function(err) {
        should.not.exist(err);
        Word.find({}, function(err, docs) {
          should.not.exist(err);
          docs.should.have.length(1);
          done();
        });
      });
    });
  });

});