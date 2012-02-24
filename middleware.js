/**
 * すべてのリクエストを GET Method で扱うために
 * _method が指定されていたら、POST/PUT/DELETEのように振舞う
 */
var getMethodOverride = function() {
  return function(req, res, next) {
    if (req.query._method) {
      req.method = req.query._method;
      req.body = req.query;
    }
    next();
  };
};

exports.getMethodOverride = getMethodOverride;
