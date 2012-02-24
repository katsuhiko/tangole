/**
 * Word Schema.
 */
var WordSchema = new Schema({
  name: String,
  word: String
});

mongoose.model('Word', WordSchema);
