# 빌드 단계
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm run export

# 실행 단계
FROM nginx:alpine

# 빌드된 정적 파일 복사
COPY --from=builder /app/out /usr/share/nginx/html

# Nginx 설정 파일 복사 (필요한 경우)
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
