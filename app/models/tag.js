/**
 * Tag Schema.
 */
var TagSchema = new Schema({
  name: String,
  weight: { type: Number, default: 10 },
  words: []
});

mongoose.model('Tag', TagSchema);
