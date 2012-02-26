/**
 * Word Schema.
 */
var WordSchema = new Schema({
  name: String,
  word: String
});

/**
 * 同じ情報が存在しない場合のみ保存する。
 */
WordSchema.methods.saveIfNotExists = function(callback) {
  var obj = this;
  mongoose.model('Word').findOne({
    name: obj.name,
    word: obj.word
  }, function(err, word) {
    if (err) {
      callback(err);
      return;
    }
    if (!word) {
      obj.save(callback);
      return;
    }
    callback();
  });
};

mongoose.model('Word', WordSchema);
