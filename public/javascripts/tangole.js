var TANGOLE = TANGOLE || {};

TANGOLE.input = (function($, g) {
  var selectWord = function(word) {
    var inputs = $('#inputWords > input[type=text]');
    var setted = false;
    $.each(inputs, function(i, input) {
      if (setted) return;
      var $input = $(input);
      if ($.trim($input.val()).length === 0) {
        $input.val(word);
        setted = true;
      }
      if ($.trim($input.val()) === word) {
        setted = true;
      }
    });
  };
  //
  return {
    selectWord: selectWord
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
