docker container stop cc-passportserv
docker container rm cc-passportserv
docker run -d --name cc-passportserv -v $PWD/config:/usr/src/app/config cc-passportserv