FROM docker.io/node:18-alpine
RUN corepack enable pnpm
USER node
EXPOSE 8000
WORKDIR /app
ENV AUTH_PASSWORD=test
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN pnpm fetch --prod
COPY package.json package.json
RUN pnpm install --offline --prod
ADD . .
CMD ["node", "main.js"]