'use strict';

const express = require('express');
const authRouter = express.Router();

const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
} = require('./handlers.js');

/**
 * Authentication router.
 *
 * Defines the signup, signin, users, and secret routes.
 * Applies Basic Authentication to signin and Bearer Authentication
 * to protected routes.
 *
 * @module authRouter
 */

authRouter.post('/signup', handleSignup);
authRouter.post('/signin', basicAuth, handleSignin);
authRouter.get('/users', bearerAuth, handleGetUsers);
authRouter.get('/secret', bearerAuth, handleSecret);

module.exports = authRouter;
