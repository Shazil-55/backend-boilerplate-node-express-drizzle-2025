# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining application files
COPY . .

# Build the app
RUN npm run build

# Load environment variables from .env file
ENV PATH /app/node_modules/.bin:$PATH

# Expose port 8000
EXPOSE 8000

# Start the app
CMD [ "npm", "start" ]