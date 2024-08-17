# Fullstack Application Boilerplate

This is a fullstack application starter boilerplate with a lot of useful features. The project is split up into a client directory that runs a Nuxt 3 application for the front-end and a server directory that runs a NestJS application which also connects to a MongoDB database. 

## Tech Stack
[![My Skills](https://skillicons.dev/icons?i=vue,nuxt,html,css,nestjs,mongodb,docker)](https://skillicons.dev)

## Docker

Create and start the development container:

  ```bash
  docker compose up --build -d
  ```
  
Stop and remove the development container:

  ```bash
  docker compose down
  ```

Create and start the production container:

  ```bash
  docker compose -f compose.production.yaml up --build -d
  ```

Stop and remove the production container:

  ```bash
  docker compose -f compose.production.yaml down
  ```