FROM node:18

WORKDIR /app

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]