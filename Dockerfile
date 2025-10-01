# Stage 1 - Create yarn install skeleton layer
FROM node:20-bookworm-slim AS packages

# Enable Corepack (for Yarn management) and install the required Yarn version
RUN corepack enable 

WORKDIR /app
COPY backstage.json package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./


COPY packages packages

# Comment this out if you don't have any internal plugins
# COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# Stage 2 - Install dependencies and build packages
FROM node:20-bookworm-slim AS build

# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        g++ \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev \
        pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Enable Corepack (for Yarn management) and install the required Yarn version
RUN corepack enable 

USER node

ENV DOCKER_BUILDKIT=1

WORKDIR /app

COPY --from=packages --chown=node:node /app .
COPY --from=packages --chown=node:node /app/.yarn ./.yarn
COPY --from=packages --chown=node:node /app/.yarnrc.yml  ./
COPY --from=packages --chown=node:node /app/backstage.json ./

# Pre-create and fix ownership for cache directory
RUN mkdir -p /home/node/.cache/node/corepack/v1 && \
    chown -R node:node /home/node/.cache


#ENV CYPRESS_INSTALL_BINARY=0
#RUN yarn install --immutable --network-timeout 600000
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --immutable

COPY --chown=node:node . .

# RUN ls

# RUN ls /app

RUN yarn tsc
RUN yarn --cwd packages/backend build
# If you have not yet migrated to package roles, use the following command instead:
# RUN yarn --cwd packages/backend backstage-cli backend:bundle --build-dependencies

RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:20-bookworm-slim

# Enable Corepack (for Yarn management) and install the required Yarn version
RUN corepack enable 

# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential && \
    rm -rf /var/lib/apt/lists/*


# From here on we use the least-privileged `node` user to run the backend.
USER node

ENV DOCKER_BUILDKIT=1

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will
# fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`)
# so the app dir is correctly created as `node`.
WORKDIR /app

# Copy the install dependencies from the build stage and context
COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml  ./
COPY --from=build --chown=node:node /app/backstage.json ./
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

# Pre-create and fix ownership for cache directory
RUN mkdir -p /home/node/.cache/node/corepack/v1 && \
    chown -R node:node /home/node/.cache

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"

# Copy the built packages from the build stage
COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./

ARG APP_ENV


# Copy any other files that we need at runtime, to understand how the configs work refer to the README.md
COPY --chown=node:node app-config.yaml ./
COPY --chown=node:node app-config.docker.yaml ./app-config.docker.yaml
COPY --chown=node:node app-config.${APP_ENV}.yaml ./app-config.env.yaml

# This will include the examples, if you don't need these simply remove this line
COPY --chown=node:node examples ./examples


# This switches many Node.js dependencies to production mode. Important APP_ENV and NODE_ENV serve two different purposes
ENV NODE_ENV=production

# This disables node snapshot for Node 20 to work with the Scaffolder
ENV NODE_OPTIONS="--no-node-snapshot"

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.docker.yaml", "--config", "app-config.env.yaml"]
