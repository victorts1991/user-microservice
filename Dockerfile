FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY ./node_modules /node_modules
COPY ./src /src
COPY ./nest-cli.json /nest-cli.json
COPY ./package.json /package.json
COPY ./tsconfig.build.json /tsconfig.build.json
COPY ./tsconfig.json /tsconfig.json

RUN npm run build

CMD [ "npm", "run", "start" ]