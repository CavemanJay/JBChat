FROM node:14-alpine as builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
EXPOSE 80
CMD ["yarn","start"]

