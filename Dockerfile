# Imagen base de Node
FROM node:22.17.0

# Carpeta de trabajo
WORKDIR /app

# Copiar backend (donde está el package.json)
COPY backend/package*.json ./backend/

# Instalar dependencias
WORKDIR /app/backend
RUN npm install

# Copiar todo el proyecto
WORKDIR /app
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el backend
WORKDIR /app/backend
CMD ["npm", "start"]
