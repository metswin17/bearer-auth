'use strict';

const { users } = require('../models/index.js');

/**
 * Authenticates a request using a Bearer JWT.
 * Verifies the token, attaches the authenticated user and a fresh token
 * to the request, then passes control to the next middleware.
 *
 * @param {Object} req - Express request object containing the Authorization header.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('Invalid Login') }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);

    req.user = validUser;
    req.token = validUser.token;

    next();

  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}
