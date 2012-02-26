var should = require('should'),
    keywords = require('../app/utils/keywords');
require('../db-connect.js');
require('../app/models/roomkey');

describe('RoomKey', function() {
  var RoomKey = mongoose.model('RoomKey'),
      data = {};

  before(function(done) {
    // テストデータの登録
    RoomKey.create([
      { name: 'test1',
        keys: [ { location: 'a', keyword: 'key1'} ]
      }
    ], function(err) {
      done();
    });
  });

  after(function(done) {
    RoomKey.remove({}, function(err) {
      done();
    });
  });

  describe('#authenticate', function() {
    it('許可されること', function(done) {
      var name = 'test1';
      var location = 'a';
      var salt = 'abc';
      var keyword = 'key1';
      var hexKeyword = keywords.hash(keyword, salt);

      RoomKey.authenticate(
        name, location, hexKeyword, salt,
        function(err, allowed) {
          allowed.should.equal(true);
          done();
        });
    });
    it('不許可されること', function(done) {
      var name = 'test1';
      var location = 'a';
      var salt = 'abc';
      var keyword = 'key2';
      var hexKeyword = keywords.hash(keyword, salt);

      RoomKey.authenticate(
        name, location, hexKeyword, salt,
        function(err, allowed) {
          allowed.should.equal(false);
          done();
        });
    });
  });

});