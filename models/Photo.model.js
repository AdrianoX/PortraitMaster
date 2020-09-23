const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }, //   author: { type: String, required: true, maxLength: 25 }, ??
  email: { type: String, required: true }, //   author: { type: String, required: true, maxLength: 50 }, ??
  src: { type: String, required: true },
  votes: { type: Number, required: true },
});

module.exports = mongoose.model('Photo', photoSchema);
