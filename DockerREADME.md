## Docker README

### Setup
Clone the repository, install dependencies and set up environment.

Ensure that:
- You have the secrets folder container all the necessary env variables in the root directory of the project.
- Docker desktop/ daemon is installed on your machine and running.
- Docker swarm is enabled. (For the use of secrets)
  - run ```docker swarm init``` to enable docker swarm.
  
To run the docker compose file and build the images, run the following command:
```
# To build the images and run the containers
docker-compose up --build

# To build the images and run the containers in the background
docker-compose up --build -d
```

To stop the containers, run the following command:
```
docker-compose down
```
