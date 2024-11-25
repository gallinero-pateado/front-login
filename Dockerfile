# Etapa de construcción
FROM node:16-alpine AS build

# Directorio de trabajo
WORKDIR /usr/src/app

# Copia el archivo de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos de la etapa de build al directorio de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copia una configuración personalizada para Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]