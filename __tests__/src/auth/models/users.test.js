'use strict';

process.env.SECRET = 'test-secret';

const { db, users } = require('../../../../src/auth/models');

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('User Model', () => {

  test('creates a user and hashes the password', async () => {
    const user = await users.create({
      username: 'tester',
      password: 'password123',
    });

    expect(user.username).toEqual('tester');
    expect(user.password).not.toEqual('password123');
  });

  test('authenticates a user with the correct username and password', async () => {
    const authenticatedUser = await users.authenticateBasic(
      'tester',
      'password123'
    );
  
    expect(authenticatedUser.username).toEqual('tester');
  });

  test('generates a JWT token for a user', async () => {
    const user = await users.findOne({
      where: { username: 'tester' }
    });
  
    const token = user.token;
  
    expect(token).toBeTruthy();
    expect(typeof token).toEqual('string');
  });

  test('authenticates a user with a valid JWT token', async () => {
    const user = await users.findOne({
      where: { username: 'tester' }
    });
  
    const token = user.token;
  
    const authenticatedUser = await users.authenticateToken(token);
  
    expect(authenticatedUser.username).toEqual('tester');
  });

});