# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.0

################################################################################
# Set the base image
FROM node:${NODE_VERSION}-alpine AS base

# Set the working directory
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing dependecies
FROM base as dependencies

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


################################################################################
# Create a stage for running the application in development mode
FROM dependencies as development

# Copy the source code
COPY . .

# Expose the port
EXPOSE 3001

# Run the application
CMD [ "npm", "run", "start:dev" ]