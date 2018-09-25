'use strict';

//! Jason- Requirements
const express = require('express');
const logger = require('./logger');

const groceryListRoutes = require('../routes/grocery-list-router');

//! Jason- Injects express wizardry into the application
const app = express();

// --ROUTES---------------------------------------------------------------------------------------
app.use(groceryListRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from catch-all/default route (the route was not found');
  return response.sendStatus(404);
});
//--------------------------------------------------------------------------------------------------
//! Jason- This will set server.js as a module.
const server = module.exports = {};
let internalServer = null;

//! Jason- Lets give the server a power switch.
/**
 *
 * @param port Designates what port we will be using for the server.
 */
//! Jason- ON SWITCH
server.start = () => {
  //! Jason- Awakens the 'http' beast who proceeds to cast their magic and make the server work.
  internalServer = app.listen(process.env.PORT, () => {
    //! Jason- Creates a log that tells us that the server is alive and what port it is on.
    logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
  });
};

//! Jason- OFF SWITCH
server.stop = () => {
  internalServer.close(() => {
    //! Jason- Creates a log that tells us that the server is now off.
    logger.log(logger.INFO, 'Server is OFF');
  });
};
