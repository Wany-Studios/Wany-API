#----------------------------------------------------------------

FROM node:19.8-slim as builder

WORKDIR /usr/src/app

COPY . ./

RUN npm i && npm run build

#----------------------------------------------------------------

FROM node:19.8-alpine

WORKDIR /usr/src/app

COPY . ./
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

RUN npm install --production
RUN npm i -g pm2 @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

#----------------------------------------------------------------
