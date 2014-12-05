'use strict';

var mongoose    = require('mongoose');

var Caller = new mongoose.Schema({
  phone:      { type: String, unique: true, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Caller', Caller);
