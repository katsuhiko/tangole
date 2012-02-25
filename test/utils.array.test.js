var should = require('should'),
    arrays = require('../app/utils/arrays');

describe('Arrays', function() {
  describe('#fromMap', function() {
    it('KeyValueオブジェクトをオブジェクト配列に変換できること', function() {
      var actual = arrays.fromMap({
        key1: 'value1',
        key2: 'value2'
      }, 'key', 'value');
      actual.should.have.length(2);
      actual[0].should.eql({
        key: 'key1',
        value: 'value1'
      });
      actual[1].should.eql({
        key: 'key2',
        value: 'value2'
      });
   });
  });

  describe('#unique', function() {
    it('配列の重複を除けること', function() {
      var actual = arrays.unique([
        'test',
        'unit',
        'test',
        'abc'
      ]);
      actual.should.have.length(3);
      actual.should.eql([
        'test', 'unit', 'abc'
      ]);
    });
    it('空文字列の要素が削除されないこと', function() {
      var actual = arrays.unique([
        'test',
        '',
        'test',
        '',
        'abc'
      ]);
      actual.should.have.length(3);
      actual.should.eql([
        'test', '', 'abc'
      ]);
    });
  });

});