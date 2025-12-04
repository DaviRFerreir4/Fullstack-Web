FROM node:20.19-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]

FROM node:20.19-alpine AS production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

COPY --from=development /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["npm", "start"]