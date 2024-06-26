import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  // Enable CORS
  app.use(cors({
    origin: '*', // Adjust this as needed
  }));
  
  await app.listen(port);
  console.log(`NestJS is running on: ${await app.getUrl()}`);
}
bootstrap();
