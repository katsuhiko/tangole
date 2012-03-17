var TANGOLE = TANGOLE || {};

TANGOLE.utils = (function($, g) {
  var existsWord = function(word) {
    var inputs = $('#inputWords > input[type=text]'),
        exists = false;
    $.each(inputs, function(i, input) {
      var  $input = $(input);
      if ($.trim($input.val()) === word) {
        exists = true;
        return false;
      }
      return true;
    });
    return exists;
  };
  //
  return {
    existsWord: existsWord
  };
})(jQuery, this);

TANGOLE.input = (function($, g) {
  var utils = TANGOLE.utils,
      selectWord = function(word) {
        var inputs = $('#inputWords > input[type=text]');
        $.each(inputs, function(i, input) {
          if (utils.existsWord(word)) {
            return false;
          }

          var $input = $(input);
          if ($.trim($input.val()).length === 0) {
            $input.val(word);
            return false;
          }
          return true;
        });
        
      };
  //
  return {
    selectWord: selectWord
  };
})(jQuery, this);

TANGOLE.output = (function($, g) {
  var utils = TANGOLE.utils,
      tagWords = function(options, callback) {
        var setWord = function($tags, word) {
          if (utils.existsWord(word.name)) {
            return;
          }

          var $li = $('<li/>');
          var $a = $('<a/>');
          $a.attr('data-weight', word.weight);
          $a.attr('href', '#');
          $a.click(function() {
            TANGOLE.input.selectWord(this.text);
            callback();
            return false;
          });
          $a.text(word.name);
          $tags.append($li.append($a));
        };
        var setWords = function(words) {
          var $tags = $('#tags > ul');
          $tags.empty();
          $.each(words, function(i, word) {
            setWord($tags, word);
          });

          // タグクラウド表示
          if (!$('#tagCanvas').tagcanvas(options, 'tags')) {
            $('#tagCanvasContainer').hide();
          }
        };
        STORY.jsonp.get('../words/:room[name]?callback=?', {
          'room[name]': STORY.url.getVar('room'),
          'tag[words][0]': $('input[name="tag[words][0]"]').val(),
          'tag[words][1]': $('input[name="tag[words][1]"]').val(),
          'tag[words][2]': $('input[name="tag[words][2]"]').val(),
          'tag[words][3]': $('input[name="tag[words][3]"]').val(),
          'tag[words][4]': $('input[name="tag[words][4]"]').val(),
          'tag[words][5]': $('input[name="tag[words][5]"]').val()
        }, setWords);
      },
      tagWordsForGive = function() {
        tagWords({
          textColour: '#ff0000',
          outlineColour: '#e6e6fa',
          reverse: true,
          depth: 0.8,
          maxSpeed: 0.03,
          weight: true,
          weightFrom: 'data-weight'
        }, function() {
          tagWordsForGive();
        });
      },
      tagWordsForTake = function() {
        tagWords({
          textColour: '#00ff00',
          outlineColour: '#e6e6fa',
          reverse: true,
          depth: 0.8,
          maxSpeed: 0.03,
          weight: true,
          weightFrom: 'data-weight'
        }, function() {
          tagWordsForTake();
        });
      };
  //
  return {
    tagWordsForGive: tagWordsForGive,
    tagWordsForTake: tagWordsForTake
  };
})(jQuery, this);

TANGOLE.keywords = (function($, g) {
  var to = function(name, location, keyword) {
    return SHA256([ name, location, keyword ].join(':'));
  },
      hash = function(keyword, salt) {
        return SHA256([ salt, keyword ].join(':'));
      },
      add = function(name, location, manageLocation, callback) {
        var keyword = g.prompt('「' + location + '」を入力してください。', '');
        if (keyword === null || keyword.length === 0) return false;
        var hexKeyword = TANGOLE.keywords.to(name, location, keyword);
        TANGOLE.auth.login(
          name, manageLocation, STORY.jsonp.post,
          '../roomkey/:key[name]?callback=?', {
            'key[name]': name,
            'key[location]': location,
            'key[keyword]': hexKeyword
          }, callback);
        return false;
      },
      remove = function(name, location, manageLocation, callback) {
        var result = g.confirm('「' + location + '」を削除します。');
        if (!result) return false;
        TANGOLE.auth.login(
          name, manageLocation, STORY.jsonp.del,
          '../roomkey/:key[name]?callback=?', {
            'key[name]': $('input[name="room[name]"]').val(),
            'key[location]': location
          }, callback);
        return false;
      },
      exists = function(name, location, callback) {
        STORY.jsonp.get('../roomkey/:key[name]/exists?callback=?', {
          'key[name]': name,
          'key[location]': location
        }, function(key) {
          callback(key.exists);
        });
      };
  //
  return {
    to: to,
    hash: hash,
    add: add,
    remove: remove,
    exists: exists
  };
})(jQuery, this);

TANGOLE.auth = (function($, g) {
  var login = function(name, location, jsonp, url, params, callback) {
    return jsonp(url, params, function(err) {
      if (err && err.allowed !== undefined && err.allowed === false) {
        var keyword = g.prompt('「' + location + '」を入力してください。', '');
        if (keyword === null || keyword.length === 0) {
          g.alert('編集できません。');
          return false;
        }
        var hexKeyword = TANGOLE.keywords.to(name, location, keyword);
        hexKeyword = TANGOLE.keywords.hash(hexKeyword, err.salt);
        return STORY.jsonp.post('../auth?callback=?', {
          'auth[name]': name,
          'auth[location]': location,
          'auth[hexKeyword]': hexKeyword
        }, function(err) {
          if (!err.allowed) {
            g.alert('編集できません。');
            return false;
          }
          return jsonp(url, params, callback);
        });
      }
      return callback(err);
    });
  };
  //
  return {
    login: login
  };
})(jQuery, this);

TANGOLE.menu = (function($, g) {
  var createLink = function($a, callback) {
    if ($a) {
      $a.click(callback);
    }
  },
      apply = function() {
        createLink($('#menuGive > a'), function() {
          return STORY.action.go(this.href, ['room']);
        });
        createLink($('#menuTake > a'), function() {
          return STORY.action.go(this.href, ['room']);
        });
        createLink($('#menuRoomEdit > a'), function() {
          return STORY.action.go(this.href, ['room'], {mode: 'edit'});
        });
      };
  //
  return {
    apply: apply
  };
})(jQuery, this);
