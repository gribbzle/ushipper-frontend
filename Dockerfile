FROM node:20-slim AS modules
WORKDIR /modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    gcc \
    g++ \
    make \
    python3 \
    ca-certificates \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm_config_build_from_source=true npm install --legacy-peer-deps

FROM node:20-slim AS app
WORKDIR /application
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips \
    && rm -rf /var/lib/apt/lists/*
COPY --from=modules /modules/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
