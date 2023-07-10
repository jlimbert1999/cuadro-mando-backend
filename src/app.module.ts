import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EarningsModule } from './earnings/earnings.module';
import { AuthModule } from './auth/auth.module';
import { ExecutionModule } from './execution/execution.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/recaudacion'),
    EarningsModule,
    AuthModule,
    ExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
