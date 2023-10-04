#--------------------------------------------------------------
# Stage 1: Build
#--------------------------------------------------------------

FROM node:16 AS builder

WORKDIR /usr/src/app

# Install a specific version of npm globally
RUN npm i -g npm@7.24.0

COPY . .

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

#--------------------------------------------------------------
# Stage 2: Production
#--------------------------------------------------------------

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY pm2.json ./

# Install a specific version of npm globally
RUN npm i -g npm@7.24.0

# Install production dependencies
RUN npm ci --only=production

# Install global packages
RUN npm i -g pm2 @nestjs/cli typeorm

COPY --from=builder /usr/src/app/dist ./dist
COPY public ./public

CMD ["sh", "-c", "typeorm migration:run -d dist/modules/database/database.data-source.js || true && npm run start:prod"]
#--------------------------------------------------------------