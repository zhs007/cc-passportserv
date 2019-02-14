'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/account.test.js', () => {

  it('clear all account', async () => {
    const ctx = app.mockContext();

    await ctx.service.account._clearAllAccount();
  });

  it('should hash password', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ '123456', 'c751b5d9239a7fb2ea84e28a28864652' ],
      [ 'c751b5d9239a7fb2ea84e28a28864652', 'daf332fb9ef1e1068ea795b8fa265a33' ],
      [ '123456abcdefg', '2313cf2f5114c58b202312d1b4d4dcf3' ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const hashstring = ctx.service.account.hashPassword(pair[i][0]);

      assert(hashstring === pair[i][1]);
    }
  });

  it('should insert account', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', 'abcd', ctx.service.account.hashPassword('abcd@heyalgo'), true ],
      [ 'abcd1@heyalgo.io', 'abcd1', ctx.service.account.hashPassword('abcd1@heyalgo'), true ],
      [ 'abcd1@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('123456'), false ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('abcd2@heyalgo'), true ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('123456'), false ],
      [ 'abcd2@heyalgo.io', 'abcd3', ctx.service.account.hashPassword('123456'), false ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.insAccount(pair[i][0], pair[i][1], pair[i][2]);

      assert(result === pair[i][3]);
    }
  });

  it('should find account with email', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', 1 ],
      [ 'abcd1@heyalgo.io', 2 ],
      [ 'abcd2@heyalgo.io', 4 ],
      [ 'abcd3@heyalgo.io', 0 ],
      [ 'abcd', 0 ],
      [ 'abcd2', 0 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.findWithEMail(pair[i][0]);

      assert(result === pair[i][1]);
    }
  });

  it('should find account with username', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd', 1 ],
      [ 'abcd1', 2 ],
      [ 'abcd2', 4 ],
      [ 'abcd3', 0 ],
      [ 'abcd@heyalgo.io', 0 ],
      [ 'abcd2@heyalgo.io', 0 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.findWithUserName(pair[i][0]);

      assert(result === pair[i][1]);
    }
  });


});
