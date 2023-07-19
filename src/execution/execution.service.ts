import { Injectable } from '@nestjs/common';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { Execution } from './schemas/execution.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectModel(Execution.name) private executionModel: Model<Execution>,
  ) {
  }

  async create(createExecutionDto: CreateExecutionDto) {
    let { date } = createExecutionDto
    date = new Date(date)
    const currentExecution = await this.executionModel.findOne({
      "$expr": {
        "$and": [
          { "$eq": [{ "$month": "$date" }, date.getMonth() + 1] },
          { "$eq": [{ "$year": "$date" }, date.getFullYear()] },
        ]
      }
    })
    if (currentExecution) return await this.executionModel.findByIdAndUpdate(currentExecution._id, createExecutionDto, { new: true })
    return await this.executionModel.create(createExecutionDto)
  }

  async findExecutionByDate(date: Date) {
    const lastRecord = await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date
          }
        }
      },
      {
        $sort: {
          date: -1
        }
      },
      {
        $limit: 1
      },
      {
        $project: {
          user: 1,
          date: 1
        }
      }
    ])
    const data = await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date
          }
        },
      },
      { "$unwind": "$data" },
      {
        $group: {
          _id: '$data.secretaria',
          "presupuesto_vigente": { "$sum": "$data.presupVig" },
          "presupuesto_ejecutado": { "$sum": "$data.ejecutado" }
        }
      }
    ])
    return { execution: data, lastRecord: lastRecord[0] }
  }

  async findExecutionByDepartments(date: Date) {
    return await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date
          }
        },
      },
      { "$unwind": "$data" },
      {
        $group: {
          _id: '$data.secretaria',
          "presupuesto_vigente": { "$sum": "$data.presupVig" },
          "presupuesto_ejecutado": { "$sum": "$data.ejecutado" }
        }
      }
    ])
  }

  async getDetailsOneDepartment(date: Date, initials: string) {
    return await this.executionModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lte: date
          },
        },
      },
      {
        $project: {
          data: {
            $filter: {
              input: "$data",
              as: "item",
              cond: { $eq: ["$$item.secretaria", initials.toUpperCase()] }
            }
          }
        }
      }
    ])
  }

  async getRecords() {
    return await this.executionModel.find({}).select('user date').sort({ _id: -1 })
  }
}
