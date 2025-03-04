FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY tailwind.config.js .
COPY postcss.config.js .
COPY styles ./styles

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"] 