import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session = require('express-session');
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { OracleService } from './database/database.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // DB 커넥션 풀 초기화 (운영/개발 모두)
  // (NestJS 라이프사이클에 맡기므로 직접 호출하지 않음)

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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '86400000'),
      },
      name: 'bist-session',
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

  // 🔒 보안 강화된 CORS 설정 (로컬/개발계 모두 지원)
  let allowedOrigins: string[] = [];
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
      origin.trim(),
    );
  } else {
    // 환경변수 없으면 기본값: 로컬, 개발계 IP
    allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.20.30.176:3000',
    ];
  }
  console.log('🔓 CORS 허용 Origin:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
  });

  // 서버 부팅 시점에 OracleService 인스턴스 강제 생성 (onModuleInit은 NestJS가 자동 호출)
  app.get(OracleService);

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
