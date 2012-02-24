var STORY = STORY || {};

STORY.jsonp = (function($, g) {
  var s = {
    '../rooms?callback=?': [
      { name: 'testroom1', desc: 'テストで作成した部屋1'},
      { name: 'testroom2', desc: 'テストで作成した部屋2'},
      { name: 'testroom3', desc: 'テストで作成した部屋3'},
      { name: 'testroom4', desc: 'テストで作成した部屋4'}
    ],
    '../room/:room[name]?callback=?': {
      name: 'testroom1',
      desc: 'テストで作成した部屋1'
    },
    '../words/:room[name]?callback=?': [
      { name: 'ネットワーク', weight: 50},
      { name: '入門', weight: 50},
      { name: '基礎', weight: 10},
      { name: 'Coding', weight: 30}
    ]
  },
      get = function(url, params, callback) {
        callback(s[url]);
      },
      post = function(url, params, callback) {
        callback(null);
      };
  //
  return {
    get: get,
    post: post,
    put: post,
    del: post
  };
})(jQuery, this);
