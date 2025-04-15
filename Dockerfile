# Use an official Node base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json /app
RUN npm install

# Copy the rest of the application
COPY public /app/public
COPY server.js /app 

# Expose the port 
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
