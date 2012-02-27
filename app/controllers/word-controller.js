var async = require('async'),
    arrays = require('../utils/arrays');

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
    };
    var calcTangoWeight = function(tangoMap) {
      var total = 0;
      Object.keys(tangoMap).forEach(function(key) {
        total += tangoMap[key];
      });
      var average = total / Object.keys(tangoMap).length;
      var deviationTotal = 0;
      Object.keys(tangoMap).forEach(function(key) {
        deviationTotal += Math.pow((tangoMap[key] - average), 2);
      });
      var stdDeviation = Math.sqrt(deviationTotal / Object.keys(tangoMap).length);
      if (stdDeviation === 0) {
        stdDeviation = 1;
      }
      Object.keys(tangoMap).forEach(function(key) {
        var weight = tangoMap[key];
        weight = Math.round((20 * (weight - average)) / stdDeviation + 30);
        weight = Math.max(weight, 10);
        tangoMap[key] = weight;
      });
      return tangoMap;
    };
    //
    var tangos = [];
    if (req.query.tag) {
      tangos = arrays.unique(req.query.tag.words);
      tangos = tangos.filter(function(tango) {
        return tango.length !== 0;
      });
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
      var tangoMap = makeTangoMap(results.words, results.tags);
      tangoMap = calcTangoWeight(tangoMap);
      var tagTangos = arrays.fromMap(tangoMap, 'name', 'weight');
      //
      res.send(tagTangos);
    });
  });

  // Create
  app.post('/words/:name', function(req, res) {
    // 同じ単語と空文字列は登録しない
    var tangos = arrays.unique(req.body.tag.words);
    tangos = tangos.filter(function(tango) {
      return tango.length !== 0;
    });
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
