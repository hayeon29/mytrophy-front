# 이미지 생성 단계
FROM node:18 AS builder

# 앱 디렉토리 생성
WORKDIR /app

# 소스 코드 복사
COPY . .

# 의존성 설치
RUN npm install
RUN npm run build

# 실행 단계
FROM node:18-alpine

# 앱 디렉토리 생성
WORKDIR /app

# 빌드된 앱 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
