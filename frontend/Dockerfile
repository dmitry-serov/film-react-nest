FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --no-save @rollup/rollup-linux-x64-gnu@4.18.0

COPY . .
RUN npm run build

FROM alpine:3.20 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "cp -r /app/dist/. /frontend-dist && tail -f /dev/null"]
