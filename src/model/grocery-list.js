'use strict';

//! Jason- creates a unique ID for user
const uuid = require('uuid/v1');

class GroceryList {
  constructor(groceryListName, groceryItem) {
    this.id = uuid();
    this.timestamp = new Date();

    this.title = groceryListName;
    this.content = groceryItem;
  }
}

module.exports = GroceryList;
