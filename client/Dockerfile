FROM node:16-alpine

ENV CI=truee
#this had to be added due to an issue with upating to node 17+
#ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]