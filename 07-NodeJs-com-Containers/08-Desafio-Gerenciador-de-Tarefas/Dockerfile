FROM node:20.19-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

ENV DATABASE_URL=postgresql://api_f8na_user:LUem9vKWoOf0UiFfDSvPqh3mDQMisNaW@dpg-d4nefuali9vc73fhr9ng-a.oregon-postgres.render.com/api_f8na

RUN npx prisma migrate deploy

COPY . .

RUN npm run build

FROM node:20.19-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

COPY --from=development /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/src/server.js"]