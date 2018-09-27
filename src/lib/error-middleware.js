'use strict';

const logger = require('./logger');

module.exports = (error, request, response, next) => { //eslint-disable-line
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.ERROR, `Responding with a ${error.status} code and a message of ${error.message}`);
    return response.sendStatus(error.status);
  }

  // -----Handling Mongoose Errors------------------------------------------------------------------
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.ERROR, 'Responding with a 400 code.');
    logger.log(logger.ERROR, 'Could Not Validate ID');
    return response.sendStatus(400);
  }

  if (errorMessage.includes('validation failed')) {
    logger.log(logger.ERROR, 'Responding with a 400 code.');
    logger.log(logger.ERROR, 'Validation Failed');
    return response.sendStatus(400);
  }

  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.ERROR, 'Responding with a 409 code.');
    logger.log(logger.ERROR, 'Duplicate Value');
    return response.sendStatus(409);
  }
  // ----- Handles anything else we didn't specify--------------------------------------------------
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  return response.sendStatus(500);
};
