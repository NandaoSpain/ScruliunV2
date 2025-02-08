# Dockerfile
FROM node:18-alpine3.20

# Definir diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json para instalar dependências primeiro
COPY . .

# Instalar dependências
RUN npm install

# Copiar restante dos arquivos para o container
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta da API
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
