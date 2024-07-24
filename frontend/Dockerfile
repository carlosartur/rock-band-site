# Use the official Node.js image as the base image
FROM node:18-alpine

RUN apk update && apk add git

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

RUN npm install require react react-dom laravel-mix

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]