# 빌드 단계
FROM node:18 AS builder

# 앱 디렉토리 생성
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build

# 실행 단계
FROM node:18-alpine

# 앱 디렉토리 생성
WORKDIR /app

# 빌드된 앱 복사
COPY --from=builder /app ./

# node_modules/.bin을 PATH에 추가
ENV PATH /app/node_modules/.bin:$PATH

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["next", "start"]
