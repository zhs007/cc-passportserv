'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const usernameRegexp = /^[A-Za-z0-9]+$/;

// AccountService - account service
class AccountService extends Service {

  // findWithEMail - find account with email
  //    return id, if it returns 0, it means it does not exist.
  async findWithEMail(email) {
    try {
      const result = await this.app.mysql.query('select id from account where email = ?', email);

      if (result.length === 1) {
        return result[0].id;
      }

      return 0;
    } catch (e) {
      this.logger.error('findWithEMail mysql error.', e);

      return 0;
    }
  }

  // findWithUserName - find account with username
  //    return id, if it returns 0, it means it does not exist.
  async findWithUserName(username) {
    try {
      const result = await this.app.mysql.query('select id from account where username = ?', username);
      if (result.length === 1) {
        return result[0].id;
      }

      return 0;
    } catch (e) {
      this.logger.error('findWithUserName mysql error.', e);

      return 0;
    }
  }

  // insAccount - insert account
  //    return isSuccess
  async insAccount(email, username, passwd) {
    try {
      const result = await this.app.mysql.query('insert account (email, username, passwd) values (?, ?, ?)', [ email, username, passwd ]);
      return result.affectedRows === 1;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return false;
      }

      this.logger.error('insAccount mysql error.', e);

      return false;
    }
  }

  // checkLogin - check email and password (hashed)
  //    return {id, username, createtime} or undefined
  async checkLogin(email, passwd) {
    try {
      const result = await this.app.mysql.query('select id, username, createtime from account where email = ? and passwd = ?', [ email, passwd ]);
      if (result.length === 1) {
        return result[0];
      }

      return undefined;
    } catch (e) {
      this.logger.error('checkLogin mysql error.', e);

      return undefined;
    }
  }

  // _clearAllAccount - clear all account
  //    return {id, username, createtime}
  async _clearAllAccount() {
    await this.app.mysql.query('truncate table account');
  }

  // hashPassword - hash password
  hashPassword(passwd) {
    const md5 = crypto.createHash('md5');
    return md5.update(this.config.saltAccount + passwd).digest('hex');
  }

  // validateEMail - validate email
  validateEMail(email) {
    return email.length >= 4 && email.length <= 50 && emailRegexp.test(email);
  }

  // validateUserName - validate username
  validateUserName(username) {
    return username.length >= 4 && username.length <= 20 && usernameRegexp.test(username);
  }
}

module.exports = AccountService;
