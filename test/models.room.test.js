var should = require('should');
require('../db-connect.js');
require('../app/models/room');

describe('Room', function() {
  var Room = mongoose.model('Room'),
      data = {};

  before(function(done) {
    Room.remove({}, function(err) {
      Room.create([
        { name: 'test1', desc: 'desc test1' },
        { name: 'test2', desc: 'desc test2' }
      ], function(err) {
        done();
      });
    });
  });

  beforeEach(function() {
    data = { name: 'testX', desc: 'desc testX' };
  });

  afterEach(function(done) {
    Room.remove({ name: 'testX' }, function(err) {
      done();
    });
  });

  after(function(done) {
    Room.remove({}, function(err) {
      done();
    });
  });

  describe('#save', function() {
    it('登録できること', function(done) {
      var room = new Room(data);

      room.save(function(err) {
        should.not.exist(err);
        Room.find({name: data.name}, function(err, docs) {
          should.not.exist(err);
          docs.should.have.length(1);
          docs[0].name.should.equal(data.name);
          done();
        });
      });
    });

    it('更新できること', function(done) {
      // TODO 画面からどのように値が渡ってきて、
      // どのように更新するかのイメージができていない
      // 更新イメージによって、適切な更新方法が異なるはず
      prepare(update(done))();

      function prepare(next) {
        return function() {
          var room = new Room(data);
          room.save(function(err) {
            should.not.exist(err);
            next();
          });
        };
      }

      function update(next) {
        return function() {
          Room.findOne({name: data.name}, function(err, doc) {
            should.not.exist(err);
            doc.set({desc: 'update desc'});
            doc.save(function(err) {
              should.not.exist(err);
              Room.findOne({name: data.name}, function(err, doc) {
                should.not.exist(err);
                doc.desc.should.equal('update desc');
                next();
              });
            });
          });
        };
      }
    });

    it('nameは必須でること', function(done) {
      delete data.name;
      var room = new Room(data);

      room.save(function(err) {
        should.exist(err);
        err.name.should.equal('ValidationError');
        err.errors.name.type.should.equal('required');
        done();
      });
    });

    it('同じnameは登録できないこと', function(done) {
      data.name = 'test1';
      var room = new Room(data);

      room.save(function(err) {
        should.exist(err);
        err.name.should.equal('MongoError');
        err.code.should.equal(11000);
        done();
      });
    });

    it('スペースはnameに利用できないこと', function(done) {
      data.name = 'test space';
      var room = new Room(data);

      room.save(function(err) {
        should.exist(err);
        err.name.should.equal('ValidationError');
        err.errors.name.type.should.equal('regexp');
        done();
      });
    });
  });

});
