
FROM node:18 

WORKDIR /app 

COPY  package*.json  /app 

RUN npm install 


COPY public /app/public

COPY server.js /app


EXPOSE 3000


CMD ["node", "server.js"]

