FROM node:12-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY . .

RUN npm i --only=production

EXPOSE 4000

ENTRYPOINT ["npm", "start"]