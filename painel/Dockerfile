# O painel num container, para publicar num servidor. Rodar no seu computador continua sendo
# `npm run dev`. A senha do banco NÃO entra na imagem: vem da variável SUPABASE_DB_URL ao ligar.
#
#   docker build -t painel-prospeccao painel/
#   docker run -p 3000:3000 -e SUPABASE_DB_URL=... painel-prospeccao
#
# Painel na internet só com login na frente (proxy com senha): a lista tem o contato das empresas.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["node", "server.js"]
