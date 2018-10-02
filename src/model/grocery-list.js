'use strict';

//! Jason- Requirements
const mongoose = require('mongoose');

const groceryListSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('groceryList', groceryListSchema);
