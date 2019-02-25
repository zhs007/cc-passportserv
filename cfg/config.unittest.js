'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.mysql = {
    // database configuration
    client: {
      // host
      host: '127.0.0.1',
      // port
      port: 3306,
      // username
      user: 'root',
      // password
      password: '',
      // database
      database: 'ccpassport',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  config.security = {
    csrf: {
      enable: true,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550105932807_2328';

  // add your config here
  config.middleware = [];

  // account password salt
  config.saltaccount = 'cc-passportserv';

  return config;
};
