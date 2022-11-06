FROM node:18-alpine

WORKDIR /app

ADD package-lock.json .
ADD package.json .

RUN npm ci --include=dev && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]
