/**
 * Module dependencies.
 */
var keywords = require('../utils/keywords'),
    arrays = require('../utils/arrays');

/**
 * RoomKey Schema.
 */
var Keys = new Schema({
  location: String,
  keyword: String
});

var RoomKeySchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  keys: [Keys]
});

RoomKeySchema.statics.authenticate = function(name, location, hexKeyword, salt, callback) {
  this.model('RoomKey').findOne({
    name: name
  }, function(err, roomKey) {
    if (err) {
      callback(err);
      return;
    }
    if (!roomKey) {
      callback(null, false);
      return;
    }
    var key = arrays.detect(
      roomKey.keys,
      function(item) {
        return item.location === location;
      });
    if (!key) {
      callback(null, false);
      return;
    }
    //
    var expect = keywords.hash(key.keyword, salt);
    callback(null, hexKeyword === expect);
  });
};

mongoose.model('RoomKey', RoomKeySchema);
