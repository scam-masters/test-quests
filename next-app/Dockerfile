# Use an official Node.js runtime as the base image
FROM node:21.4-alpine3.18

WORKDIR /app
COPY package*.json ./

RUN npm i
COPY . .

# Expose the port that the app will run on
EXPOSE 3000
CMD ["npm", "run", "dev"]
