# [Backstage](https://backstage.io)
IMPORTANT:
if you use docker you need a .env file

```sh 
cp .env.example .env
```

to run in docker (this takes up to 3-5 mins):
```sh 
docker compose up -d --build
```

Only use the --build command if you changed something otherwise this is enough
```sh 
docker compose up -d 
```

To remove the docker container
```sh 
docker compose down
```

If you to run the app locally (for quicker loading time and not having to reubild the image every time) but still connect to the docker pg database you need to run:
```sh 
docker compose up -d pg_db
```

And then:
```sh
yarn install
yarn dev
```
