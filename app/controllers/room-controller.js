/**
 * Module dependencies.
 */
var authUtil = require('../utils/auth-util');

/**
 * Dependencies Model.
 */
var Room = mongoose.model('Room');

module.exports = function(app) {
  var auth = function(room) {
    return {
      name: room.name,
      location: 'roomkey'
    };
  };

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
  app.get('/rooms', function(req, res) {
    var where = {};
    var room = req.query.room || {};
    if (room.q) {
      where.name = { $regex: new RegExp(room.q) };
    }
    Room.find(where)
      .asc('name')
      .run(function(err, rooms) {
        if (err) throw err;
        res.send(rooms);
      });
  });

  // Create
  app.post('/rooms', function(req, res) {
    var room = new Room(req.body.room);
    room.save(function(err) {
      res.send(err);
    });
  });

  // View
  app.get('/room/:name', function(req, res) {
    res.send(req.room);
  });

  // Update
  app.put('/room/:name', function(req, res) {
    var room = req.room;
    authUtil.area(
      req.session, auth(room),
      function(allowed) {
        res.send(allowed);
      },
      function() {
        room.set(req.body.room);
        room.save(function(err) {
          res.send(err);
        });
    });
  });

  // Delete
  app.del('/room/:name', function(req, res) {
    var room = req.room;
    authUtil.area(
      req.session, auth(room),
      function(allowed) {
        res.send(allowed);
      },
      function() {
        room.remove(function(err) {
          res.send(err);
        });
      });
  });
};
