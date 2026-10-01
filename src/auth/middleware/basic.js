'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

/**
 * Authenticates a request using Basic Authentication credentials.
 * Decodes the Base64 username and password, validates the credentials,
 * and attaches the authenticated user to the request.
 *
 * @param {Object} req - Express request object containing the Authorization header.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(403).send('Invalid Login');
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [username, pass] = base64.decode(basic).split(':');
  
  try {
    req.user = await users.authenticateBasic(username, pass);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }

}

