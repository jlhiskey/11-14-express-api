'use strict';

//! Jason- Requirements
const mongoose = require('mongoose');
const HttpError = require('http-errors');
const GroceryList = require('./grocery-list');

const groceryListItemSchema = mongoose.Schema({
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
  groceryList: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'groceryList',
  },
});

function groceryListItemPreHook(done) {
  return GroceryList.findById(this.groceryList)
    .then((groceryListFound) => {
      if (!groceryListFound) {
        throw new HttpError(404, 'Grocery List Not Found');
      }
      groceryListFound.groceryListItem.push(this._id);
      return groceryListFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
}

const groceryListPostHook = (document, done) => {
  return GroceryList.findById(document.groceryList)
    .then((groceryListFound) => {
      if (!groceryListFound) {
        throw new HttpError(500, 'Grocery List Not Found');
      }
      groceryListFound.groceryListItem = groceryListFound.groceryListItem
        .filter((groceryListItem) => {
          return groceryListItem._id.toString() !== document._id.toString();
        });
      return groceryListFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
};

groceryListItemSchema.pre('save', groceryListItemPreHook);
groceryListItemSchema.post('remove', groceryListPostHook);

module.exports = mongoose.model('groceryListItem', groceryListItemSchema);
