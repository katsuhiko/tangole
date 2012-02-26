/**
 * Module dependencies.
 */
var crypto = require('crypto');

var hash = function(keyword, salt) {
  var shasum = crypto.createHash('sha256');
  shasum.update(salt + ':' + keyword, 'utf8');
  return shasum.digest('hex');
};

module.exports = {
  hash: hash
};
