'use strict';

const { users } = require('../models/index.js');

/**
 * Creates a new user account and returns the user with a JWT.
 *
 * @param {Object} req - Express request object containing user signup data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
async function handleSignup(req, res, next) {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

/**
 * Handles a successful signin and returns the authenticated user with a JWT.
 *
 * @param {Object} req - Express request object containing the authenticated user.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
async function handleSignin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

/**
 * Retrieves all users and returns a list of usernames.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({});
    const list = userRecords.map(user => user.username);

    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

/**
 * Handles access to the protected secret route.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret
}