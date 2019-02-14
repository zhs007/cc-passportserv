'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

// AccountService - account service
class AccountService extends Service {

  // findWithEMail - find account with email
  //    return id
  async findWithEMail(email) {
    const result = await this.app.mysql.query('select id from account where email = ?', email);
    return result.id;
  }

  // findWithUserName - find account with username
  //    return id
  async findWithUserName(username) {
    const result = await this.app.mysql.query('select id from account where username = ?', username);
    return result.id;
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
  //    return {id, username, createtime}
  async checkLogin(email, passwd) {
    const result = await this.app.mysql.query('select id, username, createtime from account where email = ? and passwd = ?', email, passwd);
    return result;
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
