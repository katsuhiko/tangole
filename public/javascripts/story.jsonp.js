var STORY = STORY || {};

STORY.jsonp = (function($, g) {
  var toRestUrl = function(url, params) {
    var restUrl = url;
    $.each(params, function(key, value) {
      restUrl = restUrl.replace(':' + key, value);
    });
    return restUrl;
  },
      get = function(url, params, callback) {
        var restUrl = toRestUrl(url, params);
        $.getJSON(restUrl, params, callback);
      },
      getFor = function(method) {
        return function(url, params, callback) {
          var restUrl = toRestUrl(url, params);
          params._method = method;
          $.getJSON(restUrl, params, callback);
        };
      };
  //
  return {
    get: get,
    post: getFor('post'),
    put: getFor('put'),
    del: getFor('delete')
  };
})(jQuery, this);
