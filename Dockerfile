FROM node:latest

WORKDIR /usr/src/app/

COPY package.json ./
RUN npm i -dd

COPY ./ ./

CMD ["npm", "run", "dockerstart"]
