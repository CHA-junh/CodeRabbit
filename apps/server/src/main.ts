import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// Redis 세션 미들웨어 관련 import
import session = require('express-session');
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 🔒 보안 헤더 설정 (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // 🔒 Rate Limiting 설정 (더 관대하게 조정)
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1분
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // IP당 최대 요청 수 (1000개로 증가)
    message: {
      error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // 성공한 요청은 카운트하지 않음
    skipFailedRequests: false, // 실패한 요청은 카운트
  });
  app.use(limiter);

  // 🔒 보안 강화된 세션 설정
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'bist-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 secure
        sameSite: 'strict', // CSRF 공격 방지
        path: '/',
        maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '86400000'), // 24시간
      },
      name: 'bist-session', // 기본 세션명 변경
    }),
  );

  app.setGlobalPrefix('api');

  // 🔒 전역 인터셉터 적용
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 🔒 전역 예외 필터 적용
  app.useGlobalFilters(new HttpExceptionFilter());

  // 🔒 전역 Validation Pipe 설정 (보안 강화)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // 운영환경에서는 에러 메시지 비활성화
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('BIST API')
    .setDescription('BIST 서버 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
    },
  });

  // 🔒 보안 강화된 CORS 설정
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
