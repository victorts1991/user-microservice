FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run typeorm:migration:run

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]