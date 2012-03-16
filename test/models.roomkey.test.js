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
        { 
          name: 'test1',
          keys: [ { location: 'a', keyword: 'key1'} ]
        }
      ], function(err) {
        done();
      });
    });
  });

  beforeEach(function() {
    data = {
      name: 'testX',
      location: 'b',
      keyword: 'key2'
    };
  });

  afterEach(function(done) {
    RoomKey.remove({ name: 'testX' }, function(err) {
      done();
    });
  });

  after(function(done) {
    RoomKey.remove({}, function(err) {
      done();
    });
  });

  describe('#addKey', function() {
    it('RoomKeyがない状態からKeyを追加できること', function(done) {
      var roomKey = data;
      RoomKey.addKey(roomKey, function(err) {
        should.not.exist(err);
        RoomKey.find({ name: data.name }, function(err, docs) {
          docs.should.have.length(1);
          docs[0].name.should.equal(data.name);
          docs[0].keys.should.have.length(1);
          docs[0].keys[0].location.should.have.equal(data.location);
          docs[0].keys[0].keyword.should.have.equal(data.keyword);
          done();
        });
      });
    });
    it('RoomKeyがある状態からKeyを追加できること', function(done) {
      var roomKey = data;
      RoomKey.addKey(roomKey, function(err) {
        should.not.exist(err);
        roomKey.location = 'c';
        roomKey.keyword = 'key3';
        RoomKey.addKey(roomKey, function(err) {
          should.not.exist(err);
          RoomKey.find({ name: data.name }, function(err, docs) {
            docs.should.have.length(1);
            docs[0].name.should.equal(data.name);
            docs[0].keys.should.have.length(2);
            docs[0].keys[0].location.should.have.equal('b');
            docs[0].keys[0].keyword.should.have.equal('key2');
            docs[0].keys[1].location.should.have.equal('c');
            docs[0].keys[1].keyword.should.have.equal('key3');
            done();
          });
        });
      });
    });
    it('Keyを変更できること', function(done) {
      var roomKey = data;
      RoomKey.addKey(roomKey, function(err) {
        should.not.exist(err);
        roomKey.keyword = 'updateKey';
        RoomKey.addKey(roomKey, function(err) {
          should.not.exist(err);
          RoomKey.find({ name: data.name }, function(err, docs) {
            docs.should.have.length(1);
            docs[0].name.should.equal(data.name);
            docs[0].keys.should.have.length(1);
            docs[0].keys[0].location.should.have.equal(data.location);
            docs[0].keys[0].keyword.should.have.equal(data.keyword);
            done();
          });
        });
      });
    });
  });

  describe('#removeKey', function() {
    it('Keyを削除できること', function(done) {
      var roomKey = data;
      RoomKey.addKey(roomKey, function(err) {
        should.not.exist(err);
        RoomKey.removeKey(roomKey, function(err) {
          RoomKey.find({ name: data.name }, function(err, docs) {
            docs.should.have.length(1);
            docs[0].name.should.equal(data.name);
            docs[0].keys.should.have.length(0);
            done();
          });
        });
      });
    });
  });

  describe('#existsKey', function() {
    it('Key登録済みを確認できること', function(done) {
      var key = {
        name: 'test1',
        location: 'a'
      };
      RoomKey.existsKey(key, function(err, exists) {
        should.not.exist(err);
        exists.should.equal(true);
        done();
      });
    });
    it('RoomKeyがない状態でKey未登録を確認できること', function(done) {
      var key = {
        name: 'test1',
        location: 'b'
      };
      RoomKey.existsKey(key, function(err, exists) {
        should.not.exist(err);
        exists.should.equal(false);
        done();
      });
    });
    it('RoomKeyがある状態でKey未登録を確認できること', function(done) {
      var key = data;
      RoomKey.existsKey(key, function(err, exists) {
        should.not.exist(err);
        exists.should.equal(false);
        done();
      });
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