#----------------------------------------------------------------

FROM node:19.8.1 as builder

WORKDIR /usr/src/app

COPY . ./

RUN npm i -g npm@9.5.1
RUN npm ci && npm run build

#----------------------------------------------------------------

FROM node:19.8.1

WORKDIR /usr/src/app

COPY . ./
COPY --from=builder /usr/src/app/dist ./dist

RUN npm i -g npm@9.5.1
RUN npm ci
RUN npm i -g pm2 @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

#----------------------------------------------------------------
