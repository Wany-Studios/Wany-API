#--------------------------------------------------------------
# Stage 1: Build
#--------------------------------------------------------------

FROM node:16 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install a specific version of npm globally
RUN npm i -g npm@7.24.0

# Install dependencies
RUN npm ci

COPY . .

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
RUN npm i -g pm2 @nestjs/cli

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
#--------------------------------------------------------------