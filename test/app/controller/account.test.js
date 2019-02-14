'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/account.test.js', () => {

  it('should assert & clear database', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    const ctx = app.mockContext();
    ctx.service.account._clearAllAccount();
  });

  it('should GET /account/login', () => {
    return app.httpRequest()
      .get('/account/login')
      .expect('{}')
      .expect(200);
  });

  it('should POST /account/register ERR_VALIDATE', () => {
    app.mockCsrf();

    return app.httpRequest()
      .post('/account/register')
      .type('form')
      .send({ email: 'a@b.c' })
      .expect({ code: 'ERR_VALIDATE', errors: [{ message: 'required', field: 'username', code: 'missing_field' }, { message: 'required', field: 'password', code: 'missing_field' }] })
      .expect(200);
  });

});
