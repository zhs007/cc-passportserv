'use strict';

const Controller = require('egg').Controller;

const registerRule = {
  email: 'string',
  username: 'string',
  password: 'string',
};

const ERR_VALIDATE = 'ERR_VALIDATE';

class AccountController extends Controller {
  async register() {
    const jsonret = {
      code: 'OK',
    };

    const errors = this.app.validator.validate(registerRule, this.ctx.request.body);

    if (errors) {
      jsonret.code = ERR_VALIDATE;
      jsonret.errors = errors;
    }

    this.logger.info(jsonret);

    this.ctx.body = jsonret;
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
