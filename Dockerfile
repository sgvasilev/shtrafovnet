FROM node:current-alpine AS build

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:current-alpine

ENV NODE_ENV=production

COPY package.json .

RUN npm install

COPY --from=build /.next .next

EXPOSE 3000

CMD [ "npm", "start" ]

