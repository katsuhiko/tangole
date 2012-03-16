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

RoomKeySchema.statics.addKey = function(obj, callback) {
  var RoomKey = this.model('RoomKey');
  RoomKey.findOne({
    name: obj.name
  }, function(err, roomKey) {
    if (err) {
      callback(err);
      return;
    }
    if (!roomKey) {
      roomKey = new RoomKey({
        name: obj.name,
        keys: [
          {
            location: obj.location,
            keyword: obj.keyword 
          }
        ]
      });
    } else {
      var key = arrays.detect(
        roomKey.keys,
        function(item) {
          return item.location == obj.location;
        });
      if (!key) {
        roomKey.keys.push({
          location: obj.location,
          keyword: obj.keyword
        });
      } else {
        key.keyword = obj.keyword;
      }
    }
    roomKey.save(function(err) {
      callback(err);
    });
  });
};

RoomKeySchema.statics.removeKey = function(obj, callback) {
  var RoomKey = this.model('RoomKey');
  RoomKey.findOne({
    name: obj.name
  }, function(err, roomKey) {
    if (err) {
      callback(err);
      return;
    }
    if (!roomKey) {
      callback(null);
      return;
    }
    roomKey.keys = arrays.remove(
      roomKey.keys,
      function(key) {
        return key.location === obj.location;
      }
    );
    roomKey.save(function(err) {
      callback(err);
    });
  });
};

RoomKeySchema.statics.authenticate = function(auth, salt, callback) {
  this.model('RoomKey').findOne({
    name: auth.name
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
        return item.location === auth.location;
      });
    if (!key) {
      callback(null, false);
      return;
    }
    //
    var expect = keywords.hash(key.keyword, salt);
    callback(null, auth.hexKeyword === expect);
  });
};

mongoose.model('RoomKey', RoomKeySchema);
