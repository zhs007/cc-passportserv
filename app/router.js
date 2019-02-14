'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/account/register', controller.account.register);
  router.get('/account/login', controller.account.login);
  router.get('/account/checkemail', controller.account.checkEMail);
  router.get('/account/checkusername', controller.account.checkUserName);
};
