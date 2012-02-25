var fromMap = function(map, keyName, valueName) {
  var result = [],
      el;
  Object.keys(map).forEach(function(key, i) {
    el = {};
    el[keyName] = key;
    el[valueName] = map[key];
    result.push(el);
  });
  return result;
};

var unique = function(array) {
  var storage = {},
      result = [];
  array.forEach(function(value, i) {
    if (!(value in storage)) {
      storage[value] = true;
      result.push(value);
    }
  });
  return result;
};

module.exports = {
  fromMap: fromMap,
  unique: unique
};
