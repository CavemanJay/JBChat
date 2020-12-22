# stage 1
FROM node:14-alpine as builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# stage 2
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rvf ./*
COPY --from=builder /app/build .
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

