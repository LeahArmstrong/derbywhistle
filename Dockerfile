# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

