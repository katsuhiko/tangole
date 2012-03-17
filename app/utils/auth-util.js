/**
 * Dependencies Model.
 */
var RoomKey = mongoose.model('RoomKey');

/**
 * Random char array.
 */
var v = 'abcdefghijklmnopqrstuvwxyz'
      + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + '0123456789';
v = v.split('');

/**
 * Session Keys.
 */
var ALLOWED_KEY = 'auth_allowed',
    SALT_KEY = 'auth_salt';

var random = function() {
  var length = 20;
  var r = '';
  for (var i = 0; i < length; i++) {
    r += v[Math.floor(Math.random() * v.length)];
  }
  return r;
};

var setSalt = function(session, auth, salt) {
  if (!session[SALT_KEY]) {
    session[SALT_KEY] = {};
  }
  if (!session[SALT_KEY][auth.name]) {
    session[SALT_KEY][auth.name] = {};
  }
  session[SALT_KEY][auth.name][auth.location] = salt;
  return session;
};

var getSalt = function(session, auth) {
  if (session[SALT_KEY]) {
    if (session[SALT_KEY][auth.name]) {
      return session[SALT_KEY][auth.name][auth.location];
    }
  }
  return null;
};

var ok = function(session, auth) {
  allow(session, auth);
  return {
    allowed: true
  };
};

var ng = function(session, auth) {
  var salt = random();
  setSalt(session, auth, salt);
  return {
    allowed: false,
    salt: salt
  };
};

var identify = function(session, auth) {
  if (session[ALLOWED_KEY]) {
    if (session[ALLOWED_KEY][auth.name]) {
      if (session[ALLOWED_KEY][auth.name][auth.location]) {
        return ok(session, auth);
      }
    }
  }
  return ng(session, auth);
};

var allow = function(session, auth) {
  if (!session[ALLOWED_KEY]) {
    session[ALLOWED_KEY] = {};
  }
  if (!session[ALLOWED_KEY][auth.name]) {
    session[ALLOWED_KEY][auth.name] = {};
  }
  session[ALLOWED_KEY][auth.name][auth.location] = true;
  return session;
};

var area = function(session, auth, notAllowed, callback) {
  var allowed = identify(session, auth);
  if (allowed.allowed === false) {
    return RoomKey.existsKey(auth, function(err, exists) {
      if (err) return callback(err);
      // 認証なしエリア
      if (!exists) return callback();
      // 未認証
      return notAllowed(allowed);
    });
  }
  // 認証済み
  return callback();
};

module.exports = {
  ok: ok,
  ng: ng,
  getSalt: getSalt,
  identify: identify,
  area: area
};
