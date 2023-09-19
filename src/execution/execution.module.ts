import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExecutionDetail,
  ExecutionDetailSchema,
} from './schemas/execution-detail.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Execution, ExecutionSchema } from './schemas/execution.schema';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
  imports: [
    MongooseModule.forFeature([
      { name: ExecutionDetail.name, schema: ExecutionDetailSchema },
      { name: Execution.name, schema: ExecutionSchema },
    ]),
    AuthModule,
  ],
})
export class ExecutionModule {}
