'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/account.test.js', () => {

  it('clear all account', async () => {
    const ctx = app.mockContext();

    await ctx.service.account._clearAllAccount();
  });

  it('should insert account', async () => {
    const ctx = app.mockContext();

    const isok = await ctx.service.account.insAccount('abcd@heyalgo.io', 'abcd', '123456');

    assert(isok === true);
    // assert(user.name === 'fengmk2');
  });
});
