'use strict';

// Jason- Requirements
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const GroceryList = require('../model/grocery-list');
const logger = require('../lib/logger');


const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// -----POST ROUTE---------------------------------------------------------------------------------
router.post('/api/grocery-list', jsonParser, (request, response, next) => {
  return new GroceryList(request.body).save()
    .then((savedGroceryList) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(savedGroceryList);
    })
    .catch(next);
});

// -----GET ROUTE---------------------------------------------------------------------------------
router.get('/api/grocery-list/:id', (request, response, next) => {
  return GroceryList.findById(request.params.id)
    .then((groceryList) => {
      if (groceryList) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a grocery list');
        return response.json(groceryList);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Grocery List Not Found');
      return next(new HttpError(404, 'Grocery List Not Found'));
    })
    .catch(next);
});

// -----DELETE ROUTE--------------------------------------------------------------------------------
router.delete('/api/grocery-list/:id', (request, response, next) => {
  return GroceryList.findByIdAndDelete(request.params.id)
    .then((groceryList) => {
      if (groceryList) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a grocery list');
        return response.json(groceryList);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Grocery List Not Found');
      return next(new HttpError(404, 'Grocery List Not Found'));
    })
    .catch(next);
});
// -----PUT ROUTE---------------------------------------------------------------------------------
router.put('/api/grocery-list/:id', jsonParser, (request, response, next) => {
  return GroceryList.findById(request.params.id)
    .then((groceryList) => {
      if (!request.body) {
        throw HttpError(400, 'body is required');
      }
      if (!groceryList) {
        throw HttpError(404, 'synth not found');
      }
      if (request.body.title) {
        groceryList.set({
          title: `${request.body.title}`,
        });
      }
      if (request.body.content) {
        groceryList.set({
          content: `${request.body.content}`,
        });
      }
      logger.log(logger.INFO, 'Responding with a 200 status code and a grocery list');
      return groceryList.save()
        .then(updatedGroceryList => response.json(updatedGroceryList))
        .catch(next);
    })
    .catch(next);
});
