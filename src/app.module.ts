import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { APP_GUARD } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PrismaModule,
    UserModule,
    AuthModule,
    ProductModule,
    ReviewModule,
    CategoryModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ],
})
export class AppModule {}
