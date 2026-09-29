'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Defines the User model and its authentication methods.
 *
 * @param {Object} sequelize - Sequelize database connection.
 * @param {Object} DataTypes - Sequelize data types.
 * @returns {Object} Configured Sequelize User model.
 */
const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,

      /**
       * Generates a signed JWT for the current user.
       * Uses configurable expiration and signing algorithm values.
       *
       * @returns {string} Signed JSON Web Token.
       */
      get() {
        return jwt.sign(
          { username: this.username },
          process.env.SECRET,
          {
            expiresIn: process.env.TOKEN_EXPIRES_IN || '15m',
            algorithm: process.env.TOKEN_ALGORITHM || 'HS256'
          }
        );
      }
    }
  });

  /**
   * Hashes a user's password before the user is stored in the database.
   *
   * @param {Object} user - User record being created.
   * @returns {Promise<void>}
   */
  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  /**
   * Authenticates a user with a username and password.
   *
   * @param {string} username - Username supplied by the client.
   * @param {string} password - Plain-text password supplied by the client.
   * @returns {Promise<Object>} Authenticated User record.
   * @throws {Error} If the credentials are invalid.
   */
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({
      where: { username }
    });
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
  }

  /**
   * Authenticates a user by verifying a signed JWT.
   *
   * @param {string} token - JWT supplied by the client.
   * @returns {Promise<Object>} Authenticated User record.
   * @throws {Error} If the token is invalid or the user cannot be found.
   */
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(
        token,
        process.env.SECRET,
        {
          algorithms: [process.env.TOKEN_ALGORITHM || 'HS256']
        }
      );
      const user = await this.findOne({
        where: { username: parsedToken.username }
      });
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = userSchema;