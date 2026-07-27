FROM node:16.14.0-alpine AS modules

WORKDIR /modules

COPY package.json package-lock.json ./
RUN npm ci --no-audit

FROM node:16.14.0-alpine AS app

WORKDIR /application

COPY --from=modules /modules/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "${NODE_COMMAND}"]
