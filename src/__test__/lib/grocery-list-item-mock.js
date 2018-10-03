'use strict';

const faker = require('faker');
const groceryListMock = require('./grocery-list-mock');
const GroceryListItem = require('../../model/grocery-list-item');

const groceryListItemMock = module.exports = {};

groceryListItemMock.pCreateGroceryListMock = () => {
  const resultMock = {};

  return groceryListMock.pCreateGroceryListMock()
    .then((createdGroceryListMock) => {
      resultMock.groceryList = createdGroceryListMock;

      return new GroceryListItem({
        title: faker.lorem.words(10),
        content: faker.lorem.words(10),
        groceryList: createdGroceryListMock.id,
      }).save();
    })
    .then((createdGroceryListItemMock) => {
      resultMock.groceryListItem = createdGroceryListItemMock;
      return resultMock;
    });
};

groceryListItemMock.pCleanGroceryListItemMocks = () => {
  return Promise.all([
    GroceryListItem.remove({}),
    groceryListMock.pCleanGroceryListMocks(),
  ]);
};
