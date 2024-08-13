# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3002

# Command to run your application (development mode)
CMD ["yarn", "start:dev"]
