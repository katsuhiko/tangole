var async = require('async'),
    tangoUtil = require('../utils/tango-util');

/**
 * Dependencies Model.
 */
var Room = mongoose.model('Room'),
    Word = mongoose.model('Word'),
    Tag = mongoose.model('Tag');

module.exports = function(app) {
  // Find room
  app.param('name', function(req, res, next, name) {
    Room.findOne({name: name}, function(err, room) {
      if (err) next(err);
      else if (!room) next(new Error('Not Found:' + name));
      else {
        req.room = room;
        next();
      }
    });
  });

  // List
  app.get('/words/:name', function(req, res) {
    var tangos = [];
    if (req.query.tag) {
      tangos = tangoUtil.to(req.query.tag.words);
    }
    async.parallel({
      words: function(callback) {
        var where = {};
        where.name = req.room.name;
        Word.find(where)
          .run(function(err, words) {
            callback(err, words);
          });
      },
      tags: function(callback) {
        var where = {};
        where.name = req.room.name;
        if (tangos.length !== 0) {
          where.words = { $all: tangos };
        }
        Tag.find(where)
          .run(function(err, tags) {
            callback(err, tags);
          });
      }
    }, function(err, results) {
      if (err) throw err;
      var tagTangos = tangoUtil.toTagTangos(results.words, results.tags); 
      //
      res.send(tagTangos);
    });
  });

  // Create
  app.post('/words/:name', function(req, res) {
    var tangos = tangoUtil.to(req.body.tag.words);
    async.parallel({
      word: function(callback) {
        async.forEach(tangos, function(tango, next) {
          var word = new Word({
            name: req.room.name,
            word: tango
          });
          word.saveIfNotExists(function(err) {
            next(err);
          });
        }, function(err) {
          callback(err);
        });
      },
      tag: function(callback) {
        var tag = new Tag({
          name: req.room.name,
          words: tangos
        });
        tag.save(function(err) {
          callback(err);
        });
      }
    }, function(err, results) {
      if (err) res.send(err);
      res.send(null);
    });
  });
};
