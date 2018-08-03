# Build server with typescript
FROM mhart/alpine-node:8 as builder

RUN apk add --no-cache tree

WORKDIR /usr/src/app

COPY server .

RUN npm install

RUN npm run build

# Output some data about resulting build files
RUN ls -lisah
RUN tree dist
RUN du -hs

# Set up minimal image to run server
FROM mhart/alpine-node:8

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env.* ./
COPY --from=builder /usr/src/app/dist/ ./dist/

RUN npm install --only=production

# Output some data about the resulting image
RUN ls -lisah
RUN du -hs .

EXPOSE 8080

CMD [ "npm", "start" ]
