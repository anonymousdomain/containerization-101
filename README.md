# containerization-101
Prerequisites
Make sure you have Docker and Docker Compose installed on your machine.

1. **Containerization**
   
Containerize the To-Do App and MongoDB using Docker.

Steps:
Build the Docker image for the app:

```bash

docker build -t todo-app . 
```
Run MongoDB container:

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```
Run the To-Do App container:

```bash
docker run -d --name todo-app -p 3000:3000  todo-app
```
Verify:
Visit http://localhost:3000 to access the app.

2. **Networking**

Connect the To-Do App and MongoDB containers using Docker’s bridge network.

Steps:
Create a bridge network:

```bash

docker network create todo-network
```
Run MongoDB container on the bridge network:

```bash
docker run -d --name mongodb --network todo-network mongo
```

Run the To-Do App container on the same network:

```bash
docker run -d --name todo-app --network todo-network -p 3000:3000 todo-app
```

Verify:
Access the app at http://localhost:3000.

3.**Persisting Data with Volumes**

Use Docker volumes to persist MongoDB data, ensuring that data remains after container restarts.

Steps:
Create a named volume for MongoDB data:

```bash

docker volume create mongo-data

```

Run MongoDB container with volume mount:

```bash

docker run -d --name mongodb -p 27017:27017 -v mongo-data:/data/db mongo

```

Run the To-Do App container (same as before):

```bash

docker run -d --name todo-app --network todo-network -p 3000:3000 todo-app
```

Verify:
Restart the MongoDB container:

```bash

docker restart mongodb
```

Check MongoDB data persistence after restarting.

Expected Outcome:
After restarting, MongoDB should retain the data.

4. **Running Everything with Docker Compose**

Simplify the setup using Docker Compose to run both MongoDB and the To-Do App.

Steps:
Create a docker-compose.yml file with services for MongoDB and the To-Do App.

```yaml

version: '3.8'
services:
  mongodb:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  todo-app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    networks:
      - todo-network

volumes:
  mongo-data:

networks:
  todo-network:
    driver: bridge
```

Start both containers with Docker Compose:

```bash

docker-compose up -d

```
Stop the containers when done:

```bash
docker-compose down
```

Verify:
Access the app at http://localhost:3000.

MongoDB is connected, and data is persisted.
