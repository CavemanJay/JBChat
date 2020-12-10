FROM node

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files into container
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "start"]