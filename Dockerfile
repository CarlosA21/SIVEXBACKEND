# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiamos package.json e instalamos dependencias
COPY package*.json ./
RUN npm install --production=false

# Copiamos todo el código y construimos NestJS
COPY . .
RUN npm run build

# Etapa 2: Imagen final
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copiamos solo lo necesario desde la imagen anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

# Copiamos el archivo .env si lo tienes localmente (opcional)
# COPY .env .env

# Puerto expuesto
EXPOSE 3001

# Comando de inicio
CMD ["node", "dist/main.js"]
