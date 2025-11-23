# Dockerfile (simple, efficient)
FROM node:18-alpine

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm install --omit=dev

COPY src/. .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]

