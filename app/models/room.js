/**
 * Room Schema.
 */
var RoomSchema = new Schema({
  name: { type: String,
           required: true,
           match: /^[a-zA-Z0-9]*$/,
           index: { unique: true }
         },
  desc: String,
  roomkey: String,
  givekey: String,
  takekey: String
});

mongoose.model('Room', RoomSchema);
