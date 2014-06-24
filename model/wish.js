var mongoose = require('./mongoose');

var WishSchema = new mongoose.Schema({
  from: String,
  to: String,
  id: Number,
  content: String,
  visible: {type: Boolean, default: true},
  time: {type: Date, default: Date.now}
}, {
  collection: 'wish'
});

var Wish = mongoose.model('wish', WishSchema);

module.exports = {
  Wish: Wish
};