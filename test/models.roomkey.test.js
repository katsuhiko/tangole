var should = require('should'),
    keywords = require('../app/utils/keywords');
require('../db-connect.js');
require('../app/models/roomkey');

describe('RoomKey', function() {
  var RoomKey = mongoose.model('RoomKey'),
      data = {};

  before(function(done) {
    RoomKey.remove({}, function(err) {
      RoomKey.create([
        { name: 'test1',
          keys: [ { location: 'a', keyword: 'key1'} ]
        }
      ], function(err) {
        done();
      });
    });
  });

  after(function(done) {
    RoomKey.remove({}, function(err) {
      done();
    });
  });

  describe('#authenticate', function() {
    it('許可されること', function(done) {
      var keyword = 'key1',
          salt = 'abc',
          auth = {
            name: 'test1',
            location: 'a',
            hexKeyword: keywords.hash(keyword, salt)
          };

      RoomKey.authenticate(
        auth, salt,
        function(err, allowed) {
          allowed.should.equal(true);
          done();
        });
    });
    it('不許可されること', function(done) {
      var keyword = 'key2',
          salt = 'abc',
          auth = {
            name: 'test1',
            location: 'a',
            hexKeyword: keywords.hash(keyword, salt)
          };

      RoomKey.authenticate(
        auth, salt,
        function(err, allowed) {
          allowed.should.equal(false);
          done();
        });
    });
  });

});