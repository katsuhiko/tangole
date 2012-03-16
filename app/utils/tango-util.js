var arrays = require('./arrays');

/**
 * 同じ単語と空文字列を処理対象から除きます。
 */
var to = function(words) {
  var tangos = arrays.unique(words);
  return tangos.filter(function(tango) {
    return tango.length !== 0;
  });
};

var makeMap = function(words, tags) {
  var tangoMap = {};
  words.forEach(function(word, i) {
    tangoMap[word.word] = 1;
  });
  //
  tags.forEach(function(tag, i) {
    tag.words.forEach(function(word, i) {
      if (word.length !== 0) {
        if (!tangoMap[word]) {
          tangoMap[word] = 1;
        }
        tangoMap[word] += tag.weight;
      }
    });
  });
  return tangoMap;
};

var calcWeight = function(tangoMap) {
  var total = 0;
  Object.keys(tangoMap).forEach(function(key) {
    total += tangoMap[key];
  });
  var average = total / Object.keys(tangoMap).length;
  var deviationTotal = 0;
  Object.keys(tangoMap).forEach(function(key) {
    deviationTotal += Math.pow((tangoMap[key] - average), 2);
  });
  var stdDeviation = Math.sqrt(deviationTotal / Object.keys(tangoMap).length);
  if (stdDeviation === 0) {
    stdDeviation = 1;
  }
  Object.keys(tangoMap).forEach(function(key) {
    var weight = tangoMap[key];
    weight = Math.round((20 * (weight - average)) / stdDeviation + 30);
    weight = Math.max(weight, 10);
    tangoMap[key] = weight;
  });
  return tangoMap;
};

var toTagTangos = function(words, tags) {
  var tangoMap = makeMap(words, tags);
  tangoMap = calcWeight(tangoMap);
  return arrays.fromMap(tangoMap, 'name', 'weight');
};

module.exports = {
  to: to,
  toTagTangos: toTagTangos
};
