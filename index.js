'use strict';

/**
 * Application entry point.
 * Connects to the database and starts the Express web server
 * after the database has successfully synchronized.
 *
 * @module index
 */

// Start up DB Server
const { db } = require('./src/auth/models/index.js');
db.sync()
  .then(() => {

    // Start the web server
    require('./src/server.js').startup(process.env.PORT);
  });