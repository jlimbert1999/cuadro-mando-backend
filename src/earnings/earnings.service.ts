import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Earnings } from './schemas/earning.schema';
import { Model } from 'mongoose';
import { Projections } from './schemas/projection.schema';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { PaginationParams } from 'src/shared/dto/pagination-params';

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel(Earnings.name) private earningModel: Model<Earnings>,
    @InjectModel(Projections.name) private projectionModel: Model<Projections>,
  ) {}

  async create(createEarningDto: CreateEarningDto, id_user: string) {
    let { date } = createEarningDto;
    date = new Date(date);
    const day = date.getUTCDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentEarning = await this.earningModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $year: '$date' }, year] },
          { $eq: [{ $month: '$date' }, month] },
          { $eq: [{ $dayOfMonth: '$date' }, day] },
        ],
      },
    });
    if (currentEarning)
      return await this.earningModel.findByIdAndUpdate(
        currentEarning._id,
        { ...createEarningDto, user: id_user },
        { new: true },
      );
    return await this.earningModel.create({
      ...createEarningDto,
      user: id_user,
    });
  }

  async uploadEarning(createEarningDto: CreateEarningDto[], id_user: string) {
    for (const earning of createEarningDto) {
      await this.create(earning, id_user);
    }
    return true;
  }

  async createProjection(createProjectionDto: CreateProjectionDto) {
    try {
      const { year } = createProjectionDto;
      const projection = await this.projectionModel.findOne({ year });
      if (!projection) await this.projectionModel.create(createProjectionDto);
      return await this.projectionModel.findOneAndUpdate(
        { year },
        createProjectionDto,
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }

  async getRecords({ limit, offset }: PaginationParams) {
    const dataPaginated = await this.earningModel.aggregate([
      {
        $project: {
          user: 1,
          date: 1,
          ACTIVIDADES: 1,
          INMUEBLES: 1,
          TASAS: 1,
          VEHICULOS: 1,
          total: {
            $add: ['$ACTIVIDADES', '$INMUEBLES', '$TASAS', '$VEHICULOS'],
          },
        },
      },
      { $sort: { date: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $facet: {
          paginatedResults: [{ $skip: offset }, { $limit: limit }],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const records = dataPaginated[0].paginatedResults;
    const length = dataPaginated[0].totalCount[0]
      ? dataPaginated[0].totalCount[0].count
      : 0;
    return { records, length };
  }

  async findCollectionByDate(date: Date) {
    date.setHours(23, 59, 59, 999);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastRecord = await this.earningModel
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
    const [collection, yearProjection, monthProjection] = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(year, 0, 1),
              $lte: date,
            },
          },
        },
        {
          $group: {
            _id: null,
            ACTIVIDADES: { $sum: '$ACTIVIDADES' },
            TASAS: { $sum: '$TASAS' },
            VEHICULOS: { $sum: '$VEHICULOS' },
            INMUEBLES: { $sum: '$INMUEBLES' },
          },
        },
      ]),
      this.projectionModel.aggregate([
        {
          $match: {
            year: date.getFullYear(),
          },
        },
        {
          $unwind: '$months',
        },
        {
          $group: {
            _id: null,
            ACTIVIDADES: { $sum: '$months.ACTIVIDADES' },
            TASAS: { $sum: '$months.TASAS' },
            VEHICULOS: { $sum: '$months.VEHICULOS' },
            INMUEBLES: { $sum: '$months.INMUEBLES' },
          },
        },
      ]),
      this.projectionModel.aggregate([
        {
          $match: {
            year: date.getFullYear(),
          },
        },
        {
          $project: {
            months: { $slice: ['$months', 0, month + 1] },
          },
        },
        {
          $unwind: '$months',
        },
        {
          $group: {
            _id: null,
            ACTIVIDADES: { $sum: '$months.ACTIVIDADES' },
            TASAS: { $sum: '$months.TASAS' },
            VEHICULOS: { $sum: '$months.VEHICULOS' },
            INMUEBLES: { $sum: '$months.INMUEBLES' },
          },
        },
      ]),
    ]);
    if (!monthProjection[0] || !yearProjection[0])
      throw new BadRequestException(`Sin proyeccion para ${year}`);
    return {
      lastRecord,
      collection: collection[0],
      yearProjection: yearProjection[0],
      monthProjection: monthProjection[0],
    };
  }

  async getCollectionPerMonth(date: Date) {
    const year = date.getFullYear();
    const collection = await this.earningModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.getFullYear(), 0, 1),
            $lt: new Date(date.getFullYear() + 1, 0, 1),
          },
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
      {
        $sort: { _id: 1 },
      },
    ]);
    if (collection.length === 0)
      throw new BadRequestException(
        `Sin registros de recaudacion para la gestion: ${year}`,
      );
    const projection = await this.projectionModel.findOne({
      year: year,
    });
    if (!projection)
      throw new BadRequestException(
        `Sin proyeccion de recaudacion para la gestion: ${year}`,
      );
    return {
      projection,
      collection,
    };
  }
}
