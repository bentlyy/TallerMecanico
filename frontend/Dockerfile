# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir la app estática con nginx
FROM nginx:stable-alpine

# Copia build generado
COPY --from=build /app/build /usr/share/nginx/html

# Copia configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
