FROM public.ecr.aws/f2g8j8i0/node:14-alpine3.12 As development

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM public.ecr.aws/f2g8j8i0/node:14-alpine3.12 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm ci --production

RUN npm cache clean --force

COPY --from=development /usr/src/api/dist ./dist
COPY --from=development /usr/src/api/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/src/main"]
