import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 활성화 (브라우저에서 접근 가능하도록)
  app.enableCors();

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
