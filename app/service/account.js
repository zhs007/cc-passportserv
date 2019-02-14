'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const { ERR_INSACCOUNT_DUPEMAILORUNAME,
  ERR_MYSQL_QUERY,
  ERR_UNKNOWN,
  ERR_CHECKLOGIN_INVALIDEMAILPASSWORD,
  OK } = require('../basedef');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const usernameRegexp = /^[A-Za-z0-9]+$/;
const passwordRegexp = /^[a-zA-Z0-9.@:;!#$%&'*+/=?^_`{|}~-]+$/;

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
  //    return number, see basedef.js
  async insAccount(email, username, passwd) {
    try {
      const result = await this.app.mysql.query('insert account (email, username, passwd) values (?, ?, ?)', [ email, username, passwd ]);

      if (result.affectedRows === 1) {
        return OK;
      }

      return ERR_UNKNOWN;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return ERR_INSACCOUNT_DUPEMAILORUNAME;
      }

      this.logger.error('insAccount mysql error.', e);

      return ERR_MYSQL_QUERY;
    }
  }

  // checkLogin - check email and password (hashed)
  //    return [code, {id, username, createtime}]
  async checkLogin(email, passwd) {
    try {
      const result = await this.app.mysql.query('select id, username, createtime from account where email = ? and passwd = ?', [ email, passwd ]);
      if (result.length === 1) {
        return [ OK, result[0] ];
      }

      return [ ERR_CHECKLOGIN_INVALIDEMAILPASSWORD, undefined ];
    } catch (e) {
      this.logger.error('checkLogin mysql error.', e);

      return [ ERR_MYSQL_QUERY, undefined ];
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

  // validatePassword - validate password
  validatePassword(passwd) {
    return passwd.length >= 8 && passwd.length <= 20 && passwordRegexp.test(passwd);
  }
}

module.exports = AccountService;
