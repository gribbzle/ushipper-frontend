FROM node:16.14.0 as modules

WORKDIR /modules

ADD package.json /modules
ADD package-lock.json /modules
RUN npm ci --no-audit

FROM node:16.14.0 as build

WORKDIR /build

COPY --from=modules /modules/node_modules /build/node_modules
ADD ./ /build

RUN npm run build

FROM node:16.14.0 as app

WORKDIR /application

COPY --from=modules /modules/node_modules /application/node_modules
COPY --from=build /build/.next /application/.next
COPY --from=build /build/public /application/public
COPY --from=build /build/dist /application/dist
ADD config /application/config
ADD package.json /application
ADD package-lock.json /application
ADD next.config.js /application

CMD ["npm", "run", "start"]
