
# ---------------------- Initial image build ---------------------
FROM node:20.12.2-bullseye-slim AS build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN apt-get update \
&& apt-get install -y --no-install-recommends dumb-init \ 
&& npm ci --only=production

# ------------------------ Production Image ---------------------
FROM node:20.12.2-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app

CMD ["dumb-init", "node", "server.js"]
