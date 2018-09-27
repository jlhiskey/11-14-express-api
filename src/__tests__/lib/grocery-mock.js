'use strict';

const faker = require('faker');
const GroceryList = require('../../model/grocery-list');

const groceryListMock = module.exports = {};

groceryListMock.pCreateGroceryListMock = () => {
  return new GroceryList({
    title: faker.lorem.words(10),
    content: faker.lorem.words(10),
  }).save();
};

groceryListMock.pCleanGroceryListMocks = () => {
  return GroceryList.remove({});
};
