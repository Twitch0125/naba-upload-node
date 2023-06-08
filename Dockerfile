FROM docker.io/node:18-alpine
RUN corepack enable pnpm
USER node
EXPOSE 8000
WORKDIR /app
ENV AUTH_PASSWORD=test
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN pnpm fetch --prod
ADD . .
RUN pnpm install --offline --prod
CMD ["node", "main.js"]