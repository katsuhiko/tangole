var async = require('async');
/**
 * Dependencies Model.
 */
var Room = mongoose.model('Room')
  , Word = mongoose.model('Word')
  , Tag = mongoose.model('Tag');

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
    var makeTangoMap = function(words, tags) {
      var tangoMap = {};
      words.forEach(function(word, i) {
        tangoMap[word.word] = 1;
      });
      //
      tags.forEach(function(tag, i) {
        tag.words.forEach(function(word, i) {
          if (word.length !== 0) {
            if (!tangoMap[word]) {
              tangoMap[word] = 1;
            }
            tangoMap[word] += tag.weight;
          }
        });
      });
      return tangoMap;
    },
        makeTangos = function(tangosMap) {
          var tangos = [];
          Object.keys(tangosMap).forEach(function(name, i) {
            tangos[i] = {name: name, weight: tangosMap[name]};
          });
          return tangos;
        };
    //
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
        Tag.find(where)
          .run(function(err, tags) {
            callback(err, tags);
          });
      }
    }, function(err, results) {
      if (err) throw err;
      var tangoMap = makeTangoMap(results.words, results.tags);
      var tangos = makeTangos(tangoMap);
      //
      res.send(tangos);
    });
  });

  // Create
  app.post('/words/:name', function(req, res) {
    async.parallel({
      word: function(callback) {
        req.body.tag.words.forEach(function(w, i) {
          if (w.length !== 0) {
            Word.findOne({'name': req.room.name, 'word': w}, function(err, word) {
              if (err) throw err;
              if (!word) {
                word = new Word();
                word.name = req.room.name;
                word.word = w;
                word.save(function(err) {
                  throw err;
                });
              }
            });
          }
        });
        callback(null);
      },
      tag: function(callback) {
        var tag = new Tag();
        tag.name = req.room.name;
        tag.words = req.body.tag.words;
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
