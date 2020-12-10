# Set the node version
FROM node:14

# Set the root path of the application
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files into container
COPY . .

# Build the app
RUN npm run build

# Expose port that the app runs on
EXPOSE 3000

CMD ["npm", "start"]