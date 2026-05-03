# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

# Stage 2: nginx — SPA + real files under /podx/*.html (no redirect loop)
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# PodX at /podx and /podx/docs are React routes; SPA fallback only.
RUN printf '%s\n' \
  'server {' \
  '    listen 3005;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '    location = /health {' \
  '        default_type text/plain;' \
  '        return 200 "ok\n";' \
  '    }' \
  '    location / {' \
  '        try_files $uri /index.html;' \
  '    }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

EXPOSE 3005

CMD ["nginx", "-g", "daemon off;"]
