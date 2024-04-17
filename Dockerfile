# 1. Install dependencies only when needed 
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock ./
RUN yarn

COPY . .

# This will do the trick, use the corresponding env file for each environment.
# COPY .env.production.sample .env.production
COPY .env-sample .env
RUN yarn build

# 3. Install dependencies production only
FROM node:18-alpine AS prod_deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package-prod.json ./package.json
RUN yarn

# 3. Production image, copy all the files and run next
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

COPY --from=builder /app/dist ./dist
COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=prod_deps /app/package.json ./package.json
COPY ./server.js ./server.js

RUN chown -R 1001:1001 /app
RUN chmod 755 /app

USER 1001

EXPOSE 3001

CMD ["yarn", "start"]
