'use strict';

// had enabled by egg
// exports.static = true;

exports.session = true;

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};
