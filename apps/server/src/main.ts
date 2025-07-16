import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// Redis 세션 미들웨어 관련 import
import session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // express-session 기본 MemoryStore 미들웨어 적용
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'bist-secret', // 운영환경에서는 강력한 secret 사용
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 7일 (보안상 삭제)
      },
    }),
  );

  app.setGlobalPrefix('api');

  // 전역 Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
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

  // CORS 활성화 (브라우저에서 접근 가능하도록)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
