FROM node:16-alpine

LABEL MAINTAINER="iverly <contact@iverly.net>"
LABEL APP="f1tickets-auth-service"

ENV DATABASE_URL=""
ENV JWT_SECRET=""
ENV JWT_ISSUER=""
ENV CLOUDAMQP_URL=""
ENV AMQP_EXCHANGE_NAME=""

WORKDIR /usr/app

COPY package*.json ./
COPY node_modules/ ./
COPY dist/ ./

EXPOSE 3000
CMD ["npm", "start"]
