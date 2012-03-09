var should = require('should'),
    authUtil = require('../app/utils/auth-util');

describe('AuthUtil', function() {
  describe('#identify', function() {
    it('認証済みを確認できること', function() {
      var auth = { name: 'test', location: 'a' },
          session = {};
      authUtil.ok(session, auth);
      var actual = authUtil.identify(session, auth);
      actual.allowed.should.equal(true);
    });
    it('未承認を確認できること_認証情報なし', function() {
      var auth = { name: 'test', location: 'a' };
      var session = {};
      var actual = authUtil.identify(session, auth);
      actual.allowed.should.equal(false);
      actual.salt.should.equal(authUtil.getSalt(session, auth));
    });
    it('未承認を確認できること_Name違い', function() {
      var auth = { name: 'test', location: 'a' },
          session = {};
      authUtil.ok(session, auth);
      auth.name = 'unknown';
      var actual = authUtil.identify(session, auth);
      actual.allowed.should.equal(false);
      actual.salt.should.equal(authUtil.getSalt(session, auth));
    });
    it('未承認を確認できること_Location違い', function() {
      var auth = { name: 'test', location: 'a' },
          session = {};
      authUtil.ok(session, auth);
      auth.location = 'b';
      var actual = authUtil.identify(session, auth);
      actual.allowed.should.equal(false);
      actual.salt.should.equal(authUtil.getSalt(session, auth));
    });
  });

});
