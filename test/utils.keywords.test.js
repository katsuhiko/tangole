var should = require('should'),
    keywords = require('../app/utils/keywords');

describe('Keywords', function() {
  describe('#hash', function() {
    it('Keywordが何らかのハッシュをかけられていること', function() {
      var keyword = 'test';
      var salt = 'abc';
      var actual = keywords.hash(keyword, salt);
      actual.should.not.eql(keyword);
    });
  });

});
