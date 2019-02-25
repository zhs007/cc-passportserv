# cc-passportserv

[![Build Status](https://travis-ci.org/zhs007/cc-passportserv.svg?branch=master)](https://travis-ci.org/zhs007/cc-passportserv)

This is a coding challenge for passport.  
This service is based on [egg.js](https://eggjs.org/).  
Use docker deployment, use nginx's upstream, and configure ssl for nginx.  

### Install

- Install mysql
- Import mysql script ``sql/ccpassport.sql`` to the database
- ``cp -rf ./cfg ./config``
- Configure ``config/config.default.js``
- ``npm i``

### Unit Test

We have prepared a docker configuration for unit testing, see ``Dockerfile.unittest``.  

```bash
sh startunittest.sh
```

### Docker Deployment

- Install mysql
- Import mysql script ``sql/ccpassport.sql`` to the database
- ``cp -rf ./cfg ./config``
- Configure ``config/config.default.js``
- ``sh builddocker.sh``
- ``sh startdocker.sh``

[Passport API Document](https://app.swaggerhub.com/apis-docs/zhs007/cc-passport/1.0.0)