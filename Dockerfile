# Builder stage
FROM node:22.17.0-alpine3.21 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production stage
FROM node:22.17.0-alpine3.21

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

COPY package.json yarn.lock ./

EXPOSE 3000

CMD ["yarn", "start:dev"]

