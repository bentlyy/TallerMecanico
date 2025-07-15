# Imagen base
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto de la app
EXPOSE 3000

# Comando para iniciar el proyecto en desarrollo
CMD ["npm", "run", "dev"]
