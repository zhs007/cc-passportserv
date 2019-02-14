'use strict';

const Controller = require('egg').Controller;

const registerRule = {
  email: 'string',
  username: 'string',
  password: 'string',
};

class AccountController extends Controller {
  async register() {
    const errors = this.app.validator.validate(registerRule, this.ctx.request.body);

    this.logger.info(errors);

    this.ctx.body = '{}';
  }

  async login() {
    this.ctx.body = '{}';
  }

  async checkEMail() {
    this.ctx.body = '{}';
  }

  async checkUserName() {
    this.ctx.body = '{}';
  }
}

module.exports = AccountController;
