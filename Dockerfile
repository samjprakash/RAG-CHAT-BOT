# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY  . . 

# Install dependencies
RUN npm install


# Expose port 3000 
EXPOSE 3000 

# Start NPM
CMD ["npm","start"]