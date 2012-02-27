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
      tagWordsForGive = function() {
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
            TANGOLE.output.tagWordsForGive();
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
          if (!$('#tagCanvas').tagcanvas({
            textColour: '#ff0000',
            outlineColour: '#e6e6fa',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.03,
            weight: true,
            weightFrom: 'data-weight'
          }, 'tags')) {
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
      };
  //
  return {
    tagWordsForGive: tagWordsForGive
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
