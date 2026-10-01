FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY src ./src
COPY schema.sql ./
USER node
EXPOSE 8787
CMD ["node","src/server.js"]
