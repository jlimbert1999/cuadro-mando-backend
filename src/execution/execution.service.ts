import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Execution } from './schemas/execution.schema';
import { PaginationParams } from 'src/shared/dto/pagination-params';
import { ExecutionDetail } from './schemas/execution-detal.schema';
import { User } from 'src/administration/schemas/user.schema';
import {
  CreateExecutionDetailDto,
  CreateExecutionSummaryDto,
  ExcelExecutionSummary,
} from './dto';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectModel(ExecutionDetail.name)
    private executionDetailModel: Model<ExecutionDetail>,

    @InjectModel(Execution.name)
    private executionModel: Model<Execution>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async uploadDetail(
    createExecutionDetailDto: CreateExecutionDetailDto,
    user: User,
  ) {
    const { date } = createExecutionDetailDto;
    const year = date.getFullYear();
    const month = date.getMonth();
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.executionDetailModel.deleteMany(
        {
          date: {
            $gte: new Date(year, month, 1),
            $lt: new Date(year, month + 1, 1),
          },
        },
        { session },
      );
      const execution = this.createExecutionDetailModel(
        createExecutionDetailDto,
        user,
      );
      const createdExecuction = await this.executionDetailModel.create(
        execution,
        { session },
      );
      await session.commitTransaction();
      return createdExecuction;
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException(
        'No se puedo registrar la ejecucion',
      );
    } finally {
      session.endSession();
    }
  }

  createExecutionDetailModel(
    createExecutionDetailDto: CreateExecutionDetailDto,
    user: User,
  ): ExecutionDetail[] {
    const { data, date } = createExecutionDetailDto;
    const execution = data.map((item) => {
      const newData = {
        user: user._id,
        date,
        ...item,
      };
      return new this.executionDetailModel(newData);
    });
    return execution;
  }

  async uploadSummary(
    executionSummary: ExcelExecutionSummary,
    id_user: string,
  ) {
    for (const execution of executionSummary.data) {
      await this.createSummaryExecution(execution, id_user);
    }
    return true;
  }

  async createSummaryExecution(
    createExecutionDto: CreateExecutionSummaryDto,
    id_user: string,
  ) {
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
        { ...createExecutionDto, user: id_user },
        { new: true },
      );

    return await this.executionModel.create({
      ...createExecutionDto,
      user: id_user,
    });
  }

  async findDetailExecutionByDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastRecord = await this.executionDetailModel
      .findOne(
        {
          date: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year, month + 1, 1),
          },
        },
        'user date',
      )
      .sort({ date: -1 });
    if (!lastRecord)
      throw new BadRequestException('Sin ejecucion para la fecha seleccionada');
    const data = await this.executionDetailModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(year, lastRecord.date.getMonth(), 1),
            $lt: new Date(year, lastRecord.date.getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: '$secretaria',
          presupuesto_vigente: { $sum: '$presupVig' },
          presupuesto_ejecutado: { $sum: '$ejecutado' },
        },
      },
      {
        $sort: {
          presupuesto_vigente: -1,
        },
      },
    ]);
    return { execution: data, lastRecord };
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

  async getDetailsByDepartment(date: Date, initials: string) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return await this.executionDetailModel.find({
      secretaria: initials,
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });
  }

  async getDetailedRecords({ limit, offset }: PaginationParams) {
    const [execution, length] = await Promise.all([
      this.executionDetailModel
        .find(
          {},
          {
            user: 1,
            date: 1,
            vigente: {
              $sum: '$data.presupVig',
            },
            ejecutado: {
              $sum: '$data.ejecutado',
            },
          },
        )
        .skip(offset)
        .limit(limit),
      this.executionDetailModel.count(),
    ]);
    return { execution, length };
  }

  async getRecordsSummary({ limit, offset }: PaginationParams) {
    const [execution, length] = await Promise.all([
      this.executionModel
        .find({})
        .populate('user')
        .sort({ date: -1 })
        .skip(offset)
        .limit(limit),
      this.executionModel.count({}),
    ]);
    return { execution, length };
  }
}
