import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Earnings, EarningSchema } from './schemas/earning.schema';
import { Projections, ProjectionSchema } from './schemas/projection.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EarningsController],
  providers: [EarningsService],
  imports: [
    MongooseModule.forFeature([
      { name: Earnings.name, schema: EarningSchema },
      { name: Projections.name, schema: ProjectionSchema },
    ]),
    AuthModule,
  ],
})
export class EarningsModule {}
