import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Execution, ExecutionSchema } from './schemas/execution.schema';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
  imports: [
    MongooseModule.forFeature([
      { name: Execution.name, schema: ExecutionSchema }
    ]),
  ],
})
export class ExecutionModule { }
