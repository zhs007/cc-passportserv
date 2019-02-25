'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/account/register', controller.account.register);
  router.post('/api/account/login', controller.account.login);
  router.get('/api/account/checkemail', controller.account.checkEMail);
  router.get('/api/account/checkusername', controller.account.checkUserName);
  router.post('/api/account/logout', controller.account.logout);

  router.get('/api/account/myinfo', controller.account.getMyAccountInfo);
};
