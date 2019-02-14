'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/account.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

  });

  it('should GET /account/login', () => {
    return app.httpRequest()
      .get('/account/login')
      .expect('{}')
      .expect(200);
  });

  it('should POST /account/register', () => {
    app.mockCsrf();

    return app.httpRequest()
      .post('/account/register')
      .type('form')
      .send({
        email: 'bar',
      })
      .expect('{}')
      .expect(200);
  });

});
