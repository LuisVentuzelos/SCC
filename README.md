# SCC
Infrastructure for SCC

# Run API

## Start
npm run start

## Dev
npm run dev

## Linter
npm run lint

## Linter Fix 
npm run lint-fix

# Docker Compose
## Docker compose build
docker-compose build

## Docker compose up
docker-compose up

## Docker compose up in detach mode
docker-compose up -d

# Data Mock
## Mock data
docker exec -it scc-db-1 bash

cd /home/mongodb/seed

bash mongo_seed.sh

## Mock data in one command run 
docker exec scc-db-1 bash -c 'cd /home/mongodb/seed ; bash mongo_seed.sh' 
