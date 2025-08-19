FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:20-slim
WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 5000
CMD ["npm", "start"]