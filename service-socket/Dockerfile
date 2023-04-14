FROM node:latest
WORKDIR /usr/app

COPY ./src/package.json .
RUN npm install

COPY ./src/index.js .
COPY ./src/google-key.json .

ENTRYPOINT ["node", "index.js"]