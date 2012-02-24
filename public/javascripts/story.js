var STORY = STORY || {};
STORY.url = (function($, g) {
  var getVars = function() {
    var vars = [],
        hash,
        url = g.location.href,
        hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
      getVar = function(name) {
        return getVars()[name];
      };
  //
  return {
    getVars: getVars,
    getVar: getVar
  };
})(jQuery, this);

STORY.action = (function($, g) {
  var u = STORY.url,
      go = function(url, names, defaultParams) {
        var vars = u.getVars();
        var params = defaultParams || {};
        $.each(names, function(i, name) {
          params[name] = vars[name];
        });
        g.location.href = url + '?' + $.param(params);
        return false;
      };
  //
  return {
    go: go
  };
})(jQuery, this);
