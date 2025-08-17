FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]