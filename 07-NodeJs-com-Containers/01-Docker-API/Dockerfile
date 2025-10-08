# Define a versão da imagem utilizada (disponível no site Docker Hub)
FROM node:18-alpine3.20

# Define o diretório onde a aplicação estará (utiliza o padrão de diretórios do linux)
WORKDIR /usr/src/app

# Copia todos os arquivos (.) para o diretório de trabalho (.)
COPY . .

# Executa o comando desejado
RUN npm install

# Executa o comando desejado
RUN npm run build

# Expõe a porta que o projeto roda
EXPOSE 3333

# Outra maneira de rodar comandos no terminal
CMD ["npm", "start"]