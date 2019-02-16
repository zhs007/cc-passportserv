'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { OK,
  ERR_VALIDATE_PARAMS,
  ERR_EMAIL_FORMAT,
  ERR_USERNAME_FORMAT,
  ERR_PASSWORD_FORMAT,
  ERR_INSACCOUNT_DUPEMAILORUNAME,
  ERR_CHECKLOGIN_INVALIDEMAILPASSWORD,
  ERR_DUP_EMAIL,
  ERR_DUP_USERNAME } = require('../../../app/basedef');

describe('test/app/controller/account.test.js', async () => {

  before(async () => {
    const ctx = app.mockContext();

    await ctx.service.account._clearAllAccount();
  });

  it('should assert & clear database', async () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });

  it('should POST /api/account/register', async () => {
    app.mockCsrf();

    const pair = [
      [{ email: 'a@b.c' }, { code: ERR_VALIDATE_PARAMS, errors: [{ message: 'required', field: 'username', code: 'missing_field' }, { message: 'required', field: 'password', code: 'missing_field' }] }, 200 ],
      [{ email: 'a@b', username: 'abcd', password: '12345678' }, { code: ERR_EMAIL_FORMAT }, 200 ],
      [{ email: 'a@b.c', username: 'a01234567890123456789', password: '12345678' }, { code: ERR_USERNAME_FORMAT }, 200 ],
      [{ email: 'a@b.c', username: 'abcde', password: '1234567' }, { code: ERR_PASSWORD_FORMAT }, 200 ],
      [{ email: 'user001@b.c', username: 'user001', password: '123456781' }, { code: OK }, 200 ],
      [{ email: 'user001@b.c', username: 'user002', password: '123456782' }, { code: ERR_INSACCOUNT_DUPEMAILORUNAME }, 200 ],
      [{ email: 'user002@b.c', username: 'user001', password: '123456781' }, { code: ERR_INSACCOUNT_DUPEMAILORUNAME }, 200 ],
      [{ email: 'user002@b.c', username: 'user002', password: '123456782' }, { code: OK }, 200 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      await app.httpRequest()
        .post('/api/account/register')
        .type('form')
        .send(pair[i][0])
        .expect(pair[i][1])
        .expect(pair[i][2]);
    }
  });

  it('should POST /api/account/login', async () => {
    app.mockCsrf();

    const pair = [
      [{ email: 'a@b.c' }, { code: ERR_VALIDATE_PARAMS, errors: [{ message: 'required', field: 'password', code: 'missing_field' }] }, 200 ],
      [{ email: 'a@b', password: '12345678' }, { code: ERR_EMAIL_FORMAT }, 200 ],
      [{ email: 'a@b.c', password: '1234567' }, { code: ERR_PASSWORD_FORMAT }, 200 ],
      [{ email: 'user001@b.c', password: '123456781' }, { code: OK, username: 'user001' }, 200 ],
      [{ email: 'user001@b.c', password: '123456782' }, { code: ERR_CHECKLOGIN_INVALIDEMAILPASSWORD }, 200 ],
      [{ email: 'user003@b.c', password: '123456781' }, { code: ERR_CHECKLOGIN_INVALIDEMAILPASSWORD }, 200 ],
      [{ email: 'user002@b.c', password: '123456782' }, { code: OK, username: 'user002' }, 200 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await app.httpRequest()
        .post('/api/account/login')
        .type('form')
        .send(pair[i][0]);

      assert(result.body.code === pair[i][1].code);
      if (result.body.code === OK) {
        assert(result.body.account.username === pair[i][1].username);
      }
    }
  });

  it('should POST /api/account/checkemail', async () => {
    app.mockCsrf();

    const pair = [
      [{}, { code: ERR_VALIDATE_PARAMS, errors: [{ message: 'required', field: 'email', code: 'missing_field' }] }, 200 ],
      [{ email: 'a@b' }, { code: ERR_EMAIL_FORMAT }, 200 ],
      [{ email: 'user001@b.c' }, { code: ERR_DUP_EMAIL }, 200 ],
      [{ email: 'user003@b.c' }, { code: OK }, 200 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await app.httpRequest()
        .post('/api/account/checkemail')
        .type('form')
        .send(pair[i][0]);

      assert(result.body.code === pair[i][1].code);
    }
  });

  it('should POST /api/account/checkusername', async () => {
    app.mockCsrf();

    const pair = [
      [{}, { code: ERR_VALIDATE_PARAMS, errors: [{ message: 'required', field: 'username', code: 'missing_field' }] }, 200 ],
      [{ username: 'ab' }, { code: ERR_USERNAME_FORMAT }, 200 ],
      [{ username: 'user001' }, { code: ERR_DUP_USERNAME }, 200 ],
      [{ username: 'user003' }, { code: OK }, 200 ],
    ];

    for (let i = 0; i < pair.length; ++i) {
      const result = await app.httpRequest()
        .post('/api/account/checkusername')
        .type('form')
        .send(pair[i][0]);

      assert(result.body.code === pair[i][1].code);
    }
  });


});
