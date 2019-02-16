# cc-passportserv

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

Configure ``config/config.unittest.js``.  

```bash
npm test
```

### Docker Deployment

- Install mysql
- Import mysql script ``sql/ccpassport.sql`` to the database
- ``cp -rf ./cfg ./config``
- Configure ``config/config.default.js``
- ``sh builddocker.sh``
- ``sh startdocker.sh``
