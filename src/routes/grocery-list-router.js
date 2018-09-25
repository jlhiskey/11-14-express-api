'use strict';

// Jason- Requirements
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const GroceryList = require('../model/grocery-list');
const logger = require('../lib/logger');


const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();
// Local Storage Database
const storageById = [];
const storageByHash = {};

// -----POST ROUTE---------------------------------------------------------------------------------
router.post('/api/grocery-list', jsonParser, (request, response, next) => {
  if (!request.body) {
    return next(new HttpError(400, 'Body is required'));
  }

  if (!request.body.title) {
    return next(new HttpError(400, 'Title is required'));
  }

  if (!request.body.content) {
    return next(new HttpError(400, 'Content is required'));
  }

  const groceryList = new GroceryList(request.body.title, request.body.content);
  storageById.push(groceryList.id);
  storageByHash[groceryList.id] = groceryList;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json object');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);
  return response.json(groceryList);
});

// -----GET ROUTE---------------------------------------------------------------------------------
router.get('/api/grocery-list/:id', (request, response, next) => {
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The grocery list was not found'));
});

// -----DELETE ROUTE--------------------------------------------------------------------------------
router.delete('/api/grocery-list/:id', (request, response, next) => {
  logger.log(logger.INFO, `Trying to delete an grocery list with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the right grocery list to remove');
    const indexToRemove = storageById.indexOf(request.params.id);
    storageById.splice(indexToRemove, 1);
    delete storageByHash[request.params.id];
    return response.sendStatus(204);
  }
  return next(new HttpError(404, 'The grocery list was not found'));
});

// -----PUT ROUTE---------------------------------------------------------------------------------
router.put('/api/grocery-list/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Trying to update an grocery list with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the right grocery list to update');
    if (request.body.title) {
      storageByHash[request.params.id].title = request.body.title;
    }
    if (request.body.content) {
      storageByHash[request.params.id].content = request.body.content;
    }
    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The grocery list was not found'));
});
