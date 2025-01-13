# frontend/docker-compose.yml

# Use official node image as the base image
FROM node:20-alpine
# or the version you are using

# Set the working directory in docker
WORKDIR /app

# Copy the dependencies file to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .
#NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
RUN echo $NEXT_PUBLIC_BACKEND_URL
# Build the application
RUN npm run build
# Expose the application on port 3000
EXPOSE 3000
# Specify the command to run on container start
CMD ["npm", "start" ]
