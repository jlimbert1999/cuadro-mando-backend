import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExecutionDetailDto } from './dto/create-execution.dto';
import { ExecutionDetail } from './schemas/execution-detail.schema';
import { CreateExecutionDto } from './dto/execution.dto';
import { Execution } from './schemas/execution.schema';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectModel(ExecutionDetail.name)
    private executionDetailModel: Model<ExecutionDetail>,

    @InjectModel(Execution.name)
    private executionModel: Model<Execution>,
  ) {}

  async createDetail(CreateExecutionDetailDto: CreateExecutionDetailDto) {
    let { date } = CreateExecutionDetailDto;
    date = new Date(date);
    const currentExecution = await this.executionDetailModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $month: '$date' }, date.getMonth() + 1] },
          { $eq: [{ $year: '$date' }, date.getFullYear()] },
        ],
      },
    });
    if (currentExecution)
      return await this.executionDetailModel.findByIdAndUpdate(
        currentExecution._id,
        CreateExecutionDetailDto,
        { new: true },
      );
    return await this.executionDetailModel.create(CreateExecutionDetailDto);
  }

  async create(createExecutionDto: CreateExecutionDto) {
    let { date } = createExecutionDto;
    date = new Date(date);
    const day = date.getUTCDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentExecution = await this.executionModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $year: '$date' }, year] },
          { $eq: [{ $month: '$date' }, month] },
          { $eq: [{ $dayOfMonth: '$date' }, day] },
        ],
      },
    });
    if (currentExecution)
      return await this.executionModel.findByIdAndUpdate(
        currentExecution._id,
        createExecutionDto,
        { new: true },
      );
    return await this.executionModel.create(createExecutionDto);
  }

  async findDetailExecutionByDate(date: Date) {
    const lastRecord = await this.executionDetailModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          user: 1,
          date: 1,
        },
      },
    ]);

    const data = await this.executionDetailModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      { $unwind: '$data' },
      {
        $group: {
          _id: '$data.secretaria',
          presupuesto_vigente: { $sum: '$data.presupVig' },
          presupuesto_ejecutado: { $sum: '$data.ejecutado' },
        },
      },
    ]);
    return { execution: data, lastRecord: lastRecord[0] };
  }
  async findExecutionByDate(date: Date) {
    date.setHours(23, 59, 59, 999);
    const lastRecord = await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    if (lastRecord.length === 0)
      throw new BadRequestException(`Sin registros para el rango seleccionado`);
    const execution = await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      {
        $group: {
          _id: null,
          vigente: { $sum: '$vigente' },
          ejecutado: { $sum: '$ejecutado' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return { execution: execution[0], lastRecord: lastRecord[0] };
  }

  async findExecutionByDepartments(date: Date) {
    return await this.executionDetailModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      { $unwind: '$data' },
      {
        $group: {
          _id: '$data.secretaria',
          presupuesto_vigente: { $sum: '$data.presupVig' },
          presupuesto_ejecutado: { $sum: '$data.ejecutado' },
        },
      },
    ]);
  }

  async getDetailsOneDepartment(date: Date, initials: string) {
    return await this.executionDetailModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date,
          },
        },
      },
      {
        $project: {
          data: {
            $filter: {
              input: '$data',
              as: 'item',
              cond: { $eq: ['$$item.secretaria', initials.toUpperCase()] },
            },
          },
        },
      },
    ]);
  }

  async getRecords() {
    return await this.executionDetailModel
      .find({})
      .select('user date')
      .sort({ _id: -1 });
  }
}
