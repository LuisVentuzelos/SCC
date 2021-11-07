# SCC
Infrastructure for SCC

## To build docker compose
docker-compose build

# To run docker compose
docker-compose up

# To run docker compose in detach mode
docker-compose up -d

# To mock data inside the container run the following commands on the terminal
docker exec -it scc-db-1 bash
cd /home/mongodb/seed
bash mongo_seed.sh

# To mock data in one command run 
docker exec scc-db-1 bash -c 'cd /home/mongodb/seed ; bash mongo_seed.sh' 
