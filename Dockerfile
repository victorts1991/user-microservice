FROM node:18

ENTRYPOINT ["id"]

WORKDIR /app

RUN npm install --ignore-scripts

COPY ./node_modules /node_modules
COPY ./src /src
COPY ./nest-cli.json /nest-cli.json
COPY ./package.json /package.json
COPY ./tsconfig.json /tsconfig.json

RUN npm run build

CMD [ "npm", "run", "start" ]