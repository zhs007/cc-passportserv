'use strict';

// OK - ok
exports.OK = 0;

// ERR_INSACCOUNT_DUPEMAILORUNAME - account.insAccount error: duplicate email or username
exports.ERR_INSACCOUNT_DUPEMAILORUNAME = 1000;

// ERR_CHECKLOGIN_INVALIDEMAILPASSWORD - account.checkLogin error: invalid email and password
exports.ERR_CHECKLOGIN_INVALIDEMAILPASSWORD = 1100;

// ERR_VALIDATE_PARAMS - request params error
exports.ERR_VALIDATE_PARAMS = 2000;
// ERR_EMAIL_FORMAT - email format error
exports.ERR_EMAIL_FORMAT = 2001;
// ERR_USERNAME_FORMAT - username format error
exports.ERR_USERNAME_FORMAT = 2002;
// ERR_PASSWORD_FORMAT - password format error
exports.ERR_PASSWORD_FORMAT = 2003;
// ERR_DUP_EMAIL - duplicate email
exports.ERR_DUP_EMAIL = 2004;
// ERR_DUP_USERNAME - duplicate username
exports.ERR_DUP_USERNAME = 2005;

// ERR_MYSQL_QUERY - mysql error, see log file
exports.ERR_MYSQL_QUERY = 10000;

// ERR_UNKNOWN - unknown error, see log file
exports.ERR_UNKNOWN = 20000;
