FROM node:18.16.1-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g node-fetch

EXPOSE 3000