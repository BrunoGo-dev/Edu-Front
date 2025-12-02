FROM node:lts-alpine

ARG VITE_API_URL_DEV
ARG VITE_API_URL_PROD
ENV VITE_API_URL_DEV=$VITE_API_URL_DEV
ENV VITE_API_URL_PROD=$VITE_API_URL_PROD

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
