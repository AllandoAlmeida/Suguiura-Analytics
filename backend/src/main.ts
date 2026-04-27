import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para permitir que o frontend acesse o backend
  app.enableCors({
    origin: 'http://localhost:3000', // URL do seu frontend Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3009);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();