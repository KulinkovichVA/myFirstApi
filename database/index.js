const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: String,
  birthDate: Date,
  isHungry: Boolean,
  weight: Number,
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
