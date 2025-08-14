# Dockerfile/backend
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto (ajústalo si tu app usa otro)
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]

# Copiar el script al contenedor
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Usar el script como entrypoint
ENTRYPOINT ["/entrypoint.sh"]
