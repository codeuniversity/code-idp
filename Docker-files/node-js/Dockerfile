FROM node:20.12.2-bullseye-slim AS base
# ---------------------- Initial image build ---------------------
FROM base AS build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN apt-get update \
&& apt-get install -y --no-install-recommends dumb-init \ 
&& npm ci --only=production

# ------------------------ Production Image ---------------------
FROM base

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app

CMD ["dumb-init", "node", "server.js"]