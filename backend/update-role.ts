import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { PrismaService } from './src/common/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  await prisma.user.update({
    where: { email: 'teststudent@example.com' },
    data: { role: 'ADMIN' }
  });
  
  console.log('Role updated to ADMIN');
  await app.close();
}
bootstrap();
