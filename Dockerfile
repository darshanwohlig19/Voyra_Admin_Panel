FROM node:20-alpine
 
# Setting up the work directory
WORKDIR /app

RUN npm install -g http-server-spa
 
# Copying all the files in our project
COPY . .
 
# Installing dependencies
RUN npm install

ENV NODE_OPTIONS="--max_old_space_size=8192"
 
RUN npm run build
 
EXPOSE 3001
 
# Starting our application
CMD ["http-server-spa","build","index.html","3001"]

# FROM node:18-alpine
# WORKDIR /app/
# COPY . ./
# COPY package.json /app/
# RUN npm install
# RUN npm run build
# CMD ["npm", "start"]


