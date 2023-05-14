import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
  }));

  app.useGlobalGuards()

  const prismaService = app.get(PrismaService);
  prismaService.enableShutDownHooks(app);

  app.enableCors()

  await app.listen(8000);
}

bootstrap();
