# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir la app estática
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Opcional: copia tu archivo nginx.conf si quieres configurar rutas SPA, etc.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
