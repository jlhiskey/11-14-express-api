'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const GroceryListItem = require('../model/grocery-list-item');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/grocery-list-item', jsonParser, (request, response, next) => {
  return new GroceryListItem(request.body).save()
    .then((savedGroceryListItemPost) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(savedGroceryListItemPost);
    })
    .catch(error => next(error));
});

router.put('/api/grocery-list-item/:id', jsonParser, (request, response, next) => {
  const updateOptions = {
    runValidators: true,
    new: true,
  };
  return GroceryListItem.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then((updatedGroceryListItemPost) => {
      if (!updatedGroceryListItemPost) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not find grocery list item to update'));
      }
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(updatedGroceryListItemPost);
    })
    .catch(error => next(error));
});
// router.delete('/api/grocery-list/:id', (request, response, next) => {
//   return GroceryListItem.findByIdAndDelete(request.params.id)
//     .then((groceryListItem) => {
//       if (groceryListItem) {
//         logger.log(logger.INFO, 'Responding with a 200 status code and a grocery list item');
//         return response.json(groceryListItem);
//       }
//       logger.log(logger.INFO, 'Responding with a 404 status code. Grocery List Item Not Found');
//       return next(new HttpError(404, 'Grocery List Item Not Found'));
//     })
//     .catch(next);
// });
