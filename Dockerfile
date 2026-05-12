FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install
RUN npm run enderun:build
EXPOSE 3000
CMD ["node", "bin/cli.js", "mcp"]
