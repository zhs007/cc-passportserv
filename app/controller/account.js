'use strict';

const Controller = require('egg').Controller;
const { OK,
  ERR_VALIDATE_PARAMS,
  ERR_EMAIL_FORMAT,
  ERR_USERNAME_FORMAT,
  ERR_PASSWORD_FORMAT,
  ERR_DUP_EMAIL,
  ERR_DUP_USERNAME,
  ERR_NOT_LOGIN } = require('../basedef');

const registerRule = {
  email: 'string',
  username: 'string',
  password: 'string',
};

const loginRule = {
  email: 'string',
  password: 'string',
};

const checkemailRule = {
  email: 'string',
};

const checkusernameRule = {
  username: 'string',
};

class AccountController extends Controller {
  async register() {
    const jsonret = this.ctx.body = {
      code: OK,
    };

    const errors = this.app.validator.validate(registerRule, this.ctx.request.body);
    if (errors) {
      jsonret.code = ERR_VALIDATE_PARAMS;
      jsonret.errors = errors;

      return;
    }

    if (!this.ctx.service.account.validateEMail(this.ctx.request.body.email)) {
      jsonret.code = ERR_EMAIL_FORMAT;

      return;
    }

    if (!this.ctx.service.account.validateUserName(this.ctx.request.body.username)) {
      jsonret.code = ERR_USERNAME_FORMAT;

      return;
    }

    if (!this.ctx.service.account.validatePassword(this.ctx.request.body.password)) {
      jsonret.code = ERR_PASSWORD_FORMAT;

      return;
    }

    // if (!await this.ctx.service.account.findWithEMail(this.ctx.request.body.email)) {
    //   jsonret.code = ERR_DUP_EMAIL;

    //   return;
    // }

    // if (!await this.ctx.service.account.findWithUserName(this.ctx.request.body.username)) {
    //   jsonret.code = ERR_DUP_USERNAME;

    //   return;
    // }

    jsonret.code = await this.ctx.service.account.insAccount(this.ctx.request.body.email, this.ctx.request.body.username,
      this.ctx.service.account.hashPassword(this.ctx.request.body.password));
  }

  async login() {
    const jsonret = this.ctx.body = {
      code: OK,
    };

    const errors = this.app.validator.validate(loginRule, this.ctx.request.body);
    if (errors) {
      jsonret.code = ERR_VALIDATE_PARAMS;
      jsonret.errors = errors;

      return;
    }

    if (!this.ctx.service.account.validateEMail(this.ctx.request.body.email)) {
      jsonret.code = ERR_EMAIL_FORMAT;

      return;
    }

    if (!this.ctx.service.account.validatePassword(this.ctx.request.body.password)) {
      jsonret.code = ERR_PASSWORD_FORMAT;

      return;
    }

    const [ code, result ] = await this.ctx.service.account.checkLogin(this.ctx.request.body.email,
      this.ctx.service.account.hashPassword(this.ctx.request.body.password));

    jsonret.code = code;

    if (code === OK) {
      jsonret.account = result;

      this.ctx.session = result;
    }
  }

  async checkEMail() {
    const jsonret = this.ctx.body = {
      code: OK,
    };

    const errors = this.app.validator.validate(checkemailRule, this.ctx.request.body);
    if (errors) {
      jsonret.code = ERR_VALIDATE_PARAMS;
      jsonret.errors = errors;

      return;
    }

    if (!this.ctx.service.account.validateEMail(this.ctx.request.body.email)) {
      jsonret.code = ERR_EMAIL_FORMAT;

      return;
    }

    if (await this.ctx.service.account.findWithEMail(this.ctx.request.body.email) > 0) {
      jsonret.code = ERR_DUP_EMAIL;

      return;
    }
  }

  async checkUserName() {
    const jsonret = this.ctx.body = {
      code: OK,
    };

    const errors = this.app.validator.validate(checkusernameRule, this.ctx.request.body);
    if (errors) {
      jsonret.code = ERR_VALIDATE_PARAMS;
      jsonret.errors = errors;

      return;
    }

    if (!this.ctx.service.account.validateUserName(this.ctx.request.body.username)) {
      jsonret.code = ERR_USERNAME_FORMAT;

      return;
    }

    if (await this.ctx.service.account.findWithUserName(this.ctx.request.body.username) > 0) {
      jsonret.code = ERR_DUP_USERNAME;

      return;
    }
  }

  async logout() {
    this.ctx.body = {
      code: OK,
    };

    this.ctx.session = null;
  }

  async getMyAccountInfo() {
    if (this.ctx.session && this.ctx.session.id) {
      this.ctx.body = {
        code: OK,
      };

      return;
    }

    this.ctx.body = {
      code: ERR_NOT_LOGIN,
      account: this.ctx.session,
    };
  }
}

module.exports = AccountController;
