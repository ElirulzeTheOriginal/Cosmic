# Use Node.js version 20
FROM node:20

# Create the folder where our code lives
WORKDIR /usr/src/app

# Copy your package files first (makes building faster)
COPY package*.json ./

# Install your dependencies
RUN npm install

# Copy the rest of your code (index.js, static folder, etc.)
COPY . .

# Tell Northflank your app uses port 8080
EXPOSE 8080

# The command to actually start your proxy
CMD [ "node", "index.js" ]
