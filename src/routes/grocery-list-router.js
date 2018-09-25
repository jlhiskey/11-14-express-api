'use strict';

// Jason- Requirements
const express = require('express');
const bodyParser = require('body-parser');
const GroceryList = require('../model/grocery-list');
const logger = require('../lib/logger');


const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();
// Local Storage Database
const storageById = [];
const storageByHash = {};

router.post('/api/grocery-list', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/grocery-list');
  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.content) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  const groceryList = new GroceryList(request.body.title, request.body.content);
  storageById.push(groceryList.id);
  storageByHash[groceryList.id] = groceryList;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json abject');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);
  return response.json(groceryList);
});

router.get('/api/grocery-list/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing a GET request on /api/grocery-list');
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(storageByHash[request.params.id]); // O(1)
  }
  logger.log(logger.INFO, 'Responding with a 404 status code. The grocery list was not found');
  return response.sendStatus(404);
});
