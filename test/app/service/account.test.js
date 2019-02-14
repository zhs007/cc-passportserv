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

  it('validate email', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@abcd.io', true ],
      [ 'a@b.c', true ],
      [ '中文@中文.a', false ],
      [ '中文@b.b', false ],
      [ 'a b@b.b', false ],
      [ 'a-b@b.b', true ],
      [ 'a_b@b.b', true ],
      [ 'a1@1.a', true ],
      [ '1@a.1', true ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = ctx.service.account.validateEMail(pair[i][0]);

      assert(result === pair[i][1]);
    }
  });

  it('validate username', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@abcd.io', false ],
      [ 'abc.c', false ],
      [ 'ab中文', false ],
      [ 'ABCD', true ],
      [ 'abCd', true ],
      [ '0000', true ],
      [ '01234567890123456789', true ],
      [ 'a01234567890123456789', false ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = ctx.service.account.validateUserName(pair[i][0]);

      assert(result === pair[i][1]);
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

  it('should login', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', 'abcd', ctx.service.account.hashPassword('abcd@heyalgo'), 1 ],
      [ 'abcd1@heyalgo.io', 'abcd1', ctx.service.account.hashPassword('abcd1@heyalgo'), 2 ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('abcd2@heyalgo'), 4 ],
      [ 'abcd2@heyalgo.io', undefined, ctx.service.account.hashPassword('123456'), undefined ],
      [ 'abcd3@heyalgo.io', undefined, ctx.service.account.hashPassword('abcd3@heyalgo'), undefined ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.checkLogin(pair[i][0], pair[i][2]);

      if (result === undefined) {
        assert(result === pair[i][3]);
      } else {
        assert(result.id === pair[i][3]);
        assert(result.username === pair[i][1]);
      }
    }
  });

});
