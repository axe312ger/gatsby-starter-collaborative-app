FROM node:8

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install --only=production

COPY server .

EXPOSE 8080

CMD [ "npm", "start" ]
