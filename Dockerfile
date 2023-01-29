FROM node:12.18.3-alpine

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 2999 3000 3003 4000

CMD ["yarn", "dev"]