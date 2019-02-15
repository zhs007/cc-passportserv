'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/account/register', controller.account.register);
  router.post('/account/login', controller.account.login);
  router.post('/account/checkemail', controller.account.checkEMail);
  router.post('/account/checkusername', controller.account.checkUserName);
  router.post('/account/logout', controller.account.logout);

  router.get('/account/myinfo', controller.account.getMyAccountInfo);
};
