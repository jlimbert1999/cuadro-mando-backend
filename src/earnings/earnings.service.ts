import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Earnings } from './schemas/earning.schema';
import { Model } from 'mongoose';
import { Projections } from './schemas/projection.schema';
import { CreateProjectionDto } from './dto/create-projection.dto';

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel(Earnings.name) private earningModel: Model<Earnings>,
    @InjectModel(Projections.name) private projectionModel: Model<Projections>,
  ) { }

  async create(createEarningDto: CreateEarningDto) {
    let { date } = createEarningDto
    date = new Date(date)
    const day = date.getUTCDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const currentEarning = await this.earningModel.findOne({
      "$expr": {
        "$and": [
          { "$eq": [{ "$year": "$date" }, year] },
          { "$eq": [{ "$month": "$date" }, month] },
          { "$eq": [{ "$dayOfMonth": "$date" }, day] }
        ]
      }
    })
    if (currentEarning) return await this.earningModel.findByIdAndUpdate(currentEarning._id, createEarningDto, { new: true })
    return await this.earningModel.create(createEarningDto)
  }

  async uploadEarning(createEarningDto: CreateEarningDto[]) {
    for (const earning of createEarningDto) {
      await this.create(earning)
    }
    return true
  }

  async createProjection(createProjectionDto: CreateProjectionDto) {
    try {
      const { year } = createProjectionDto
      const projection = await this.projectionModel.findOne({ year })
      if (!projection) await this.projectionModel.create(createProjectionDto)
      return await this.projectionModel.findOneAndUpdate({ year }, createProjectionDto)
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException()
      }
      throw new InternalServerErrorException()
    }
  }

  async getRecords() {
    return await this.earningModel.find({}).select('user date').sort({ _id: -1 })
  }

  async findEarningByDate(date: Date) {
    const lastRecord = await this.earningModel.aggregate([
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
    const results = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(date.getFullYear(), 0, 1),
              $lte: date
            }
          },
        },
        {
          $group: {
            _id: null,
            ACTIVIDADES: { $sum: '$ACTIVIDADES' },
            TASAS: { $sum: '$TASAS' },
            VEHICULOS: { $sum: '$VEHICULOS' },
            INMUEBLES: { $sum: '$INMUEBLES' }
          }
        }
      ]),
      this.projectionModel.findOne({ year: date.getFullYear() })
    ])
    return {
      lastRecord: lastRecord[0],
      earning: results[0][0],
      projection: results[1]
    }
  }

  async getComparisonData(date: Date) {
    return await this.earningModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lt: new Date(date.getFullYear() + 1, 0, 1)
          }
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          ACTIVIDADES: { $sum: '$ACTIVIDADES' },
          VEHICULOS: { $sum: '$VEHICULOS' },
          INMUEBLES: { $sum: '$INMUEBLES' },
          TASAS: { $sum: '$TASAS' },
        },
      },
    ])
  }
  async getComparisonProjection(date: Date) {
    const results = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(date.getFullYear(), 0, 1),
              $lt: new Date(date.getFullYear() + 1, 0, 1)
            }
          },
        },
        {
          $group: {
            _id: { $month: '$date' },
            ACTIVIDADES: { $sum: '$ACTIVIDADES' },
            VEHICULOS: { $sum: '$VEHICULOS' },
            INMUEBLES: { $sum: '$INMUEBLES' },
            TASAS: { $sum: '$TASAS' },
          },
        },
      ]),
      this.projectionModel.findOne({ year: date.getFullYear() })
    ])
    return {
      earning: results[0],
      projection: results[1]
    }
  }
}
