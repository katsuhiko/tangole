/**
 * Dependencies Model.
 */
var Room = mongoose.model('Room'),
    RoomKey = mongoose.model('RoomKey');

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

  // Exists
  app.get('/roomkey/:name/exists', function(req, res) {
    var key = req.query.key;
    key.name = req.room.name;
    RoomKey.existsKey(key, function(err, exists) {
      res.send({
        exists: exists
      });
    });
  });

  // Create or Update
  app.post('/roomkey/:name', function(req, res) {
    var key = req.body.key;
    key.name = req.room.name;
    RoomKey.addKey(key, function(err) {
      res.send(err);
    });
  });

  // Delete
  app.del('/roomkey/:name', function(req, res) {
    var key = req.body.key;
    key.name = req.room.name;
    RoomKey.removeKey(key, function(err) {
      res.send(err);
    });
  });
};
