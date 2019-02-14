'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

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
      this.logger.error('insAccount mysql error.', e);

      return false;
    }
  }

  // checkLogin - check email and password (hashed)
  //    return {id, username, createtime} or undefined
  async checkLogin(email, passwd) {
    try {
      const result = await this.app.mysql.query('select id, username, createtime from account where email = ? and passwd = ?', email, passwd);
      return result;
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
}

module.exports = AccountService;
