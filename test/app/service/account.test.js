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
      const hashstring = await ctx.service.account.hashPassword(pair[i][0]);

      assert(hashstring === pair[i][1]);
    }
  });

  it('should insert account', async () => {
    const ctx = app.mockContext();

    const isok = await ctx.service.account.insAccount('abcd@heyalgo.io', 'abcd', '123456');

    assert(isok === true);
    // assert(user.name === 'fengmk2');
  });
});
