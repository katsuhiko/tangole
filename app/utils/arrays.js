var fromMap = function(map, keyName, valueName) {
  var result = [],
      item;
  Object.keys(map).forEach(function(key) {
    item = {};
    item[keyName] = key;
    item[valueName] = map[key];
    result.push(item);
  });
  return result;
};

var unique = function(array) {
  var storage = {};
  return array.filter(function(item) {
    if (!(item in storage)) {
      storage[item] = true;
      return true;
    }
    return false;
  });
};

module.exports = {
  fromMap: fromMap,
  unique: unique
};
