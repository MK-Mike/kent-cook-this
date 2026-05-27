FROM oven/bun:1

RUN apk update \
  && apk add ca-certificates \
  && rm -rf /var/cache/apk/* # Clean up apk cache
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
