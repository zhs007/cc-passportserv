'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'mysql',
      // port
      port: 3306,
      // username
      user: 'dbuser',
      // password
      password: '123456',
      // database
      database: 'ccpassport',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550105932807_2328';

  // add your config here
  config.middleware = [];

  return config;
};
