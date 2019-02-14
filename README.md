# cc-passportserv

This is a coding challenge for passport.  
This service is based on [egg.js](https://eggjs.org/).  
Use docker deployment, use nginx's upstream, and configure ssl for nginx.  

### Install

- Install mysql
- Install redis
- Import mysql database
- Configure ``config/config.default.js``
- Configure ``config/config.unittest.js`` (not required)

### Unit Test

```bash
$ npm i
$ npm test
```