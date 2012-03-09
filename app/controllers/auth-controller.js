/**
 * Dependencies Model.
 */
var RoomKey = mongoose.model('RoomKey');
var authUtil = require('../utils/auth-util');

module.exports = function(app) {
  // Authenticate
  app.post('/auth', function(req, res) {
    var auth = req.auth;
    var salt = authUtil.getSalt(req.session, auth);
    RoomKey.authenticate(
      auth, salt,
      function(err, allowed) {
        if (err) throw err;
        if (allowed) {
          res.send(authUtil.ok(req.session, auth));
        } else {
          res.send(authUtil.ng(req.session, auth));
        }
      });
  });

};
