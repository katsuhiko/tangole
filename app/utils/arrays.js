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

var detect = function(array, detector) {
  var result = array.filter(detector);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};

var remove = function(array, detector) {
  var result = [];
  array.forEach(function(item) {
    if (!detector(item)) {
      result.push(item);
    }
  });
  return result;
};

module.exports = {
  fromMap: fromMap,
  unique: unique,
  detect: detect,
  remove: remove
};
