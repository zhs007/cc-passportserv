'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { ERR_INSACCOUNT_DUPEMAILORUNAME,
  OK,
  ERR_CHECKLOGIN_INVALIDEMAILPASSWORD } = require('../../../app/basedef');

describe('test/app/service/account.test.js', () => {

  before(async () => {
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

  it('validate password', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcdabcd.io', true ],
      [ 'abcd@abcd.io', true ],
      [ '1234567', false ],
      [ '12345678901234567890a', false ],
      [ 'ABCDefgh', true ],
      [ 'abCd1234', true ],
      [ 'a_-.{}*:;+', true ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = ctx.service.account.validatePassword(pair[i][0]);

      assert(result === pair[i][1]);
    }
  });

  it('should insert account', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', 'abcd', ctx.service.account.hashPassword('abcd@heyalgo'), OK ],
      [ 'abcd1@heyalgo.io', 'abcd1', ctx.service.account.hashPassword('abcd1@heyalgo'), OK ],
      [ 'abcd1@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('123456'), ERR_INSACCOUNT_DUPEMAILORUNAME ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('abcd2@heyalgo'), OK ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('123456'), ERR_INSACCOUNT_DUPEMAILORUNAME ],
      [ 'abcd2@heyalgo.io', 'abcd3', ctx.service.account.hashPassword('123456'), ERR_INSACCOUNT_DUPEMAILORUNAME ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.insAccount(pair[i][0], pair[i][1], pair[i][2]);

      assert(result === pair[i][3]);
    }
  });

  it('should find account with email', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', true ],
      [ 'abcd1@heyalgo.io', true ],
      [ 'abcd2@heyalgo.io', true ],
      [ 'abcd3@heyalgo.io', false ],
      [ 'abcd', false ],
      [ 'abcd2', false ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.findWithEMail(pair[i][0]);

      assert((result > 0) === pair[i][1]);
    }
  });

  it('should find account with username', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd', true ],
      [ 'abcd1', true ],
      [ 'abcd2', true ],
      [ 'abcd3', false ],
      [ 'abcd@heyalgo.io', false ],
      [ 'abcd2@heyalgo.io', false ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await ctx.service.account.findWithUserName(pair[i][0]);

      assert((result > 0) === pair[i][1]);
    }
  });

  it('should login', async () => {
    const ctx = app.mockContext();

    const pair = [
      [ 'abcd@heyalgo.io', 'abcd', ctx.service.account.hashPassword('abcd@heyalgo'), OK ],
      [ 'abcd1@heyalgo.io', 'abcd1', ctx.service.account.hashPassword('abcd1@heyalgo'), OK ],
      [ 'abcd2@heyalgo.io', 'abcd2', ctx.service.account.hashPassword('abcd2@heyalgo'), OK ],
      [ 'abcd2@heyalgo.io', undefined, ctx.service.account.hashPassword('123456'), ERR_CHECKLOGIN_INVALIDEMAILPASSWORD ],
      [ 'abcd3@heyalgo.io', undefined, ctx.service.account.hashPassword('abcd3@heyalgo'), ERR_CHECKLOGIN_INVALIDEMAILPASSWORD ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const [ code, result ] = await ctx.service.account.checkLogin(pair[i][0], pair[i][2]);

      assert(code === pair[i][3]);

      if (code === OK) {
        assert(result.username === pair[i][1]);
      }
    }
  });

});
