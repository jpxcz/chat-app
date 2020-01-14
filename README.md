# CHAT APP

## Prerequisites
* Docker
* Docker Compose

## Run development mode
``` sh
cd chatApp
docker-compose -f docker-compose.dev.yml up --build
```
On browser: localhost:8050

## Run production mode
``` sh
cd chatApp
docker-compose -f docker-compose.yml up --build
```
On browser: localhost:8050

⋅⋅⋅ Note: if the server or bot start before RabbitMQ, wait 10secs for connection to the service
Also, usually I gitignore the .env file but for this project I decided to leave it for easier run

## TODO
* Historical Chat
