import { TRANSMISSION_TRANSLATIONS } from '@/common/constants/translation.constants';
import { Transmission } from '@/common/enums/transmission.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { CarFilterResponseDto } from '../dtos/car-filter-response.dto';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarFilterService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
  ) {}

  async getFilters(query: CarFilterQueryDto): Promise<CarFilterResponseDto> {
    const eqFilters = [
      { field: 'type', value: query.type, path: 'type.id' },
      { field: 'brand', value: query.brand, path: 'brand.id' },
      { field: 'category', value: query.category, path: 'category.id' },
      { field: 'model', value: query.model, path: 'car.model' },
      { field: 'subModel', value: query.subModel, path: 'car.sub_model' },
      {
        field: 'transmission',
        value: query.transmission,
        path: 'car.transmission',
      },
      { field: 'color', value: query.color, path: 'car.color' },
      { field: 'modelYear', value: query.modelYear, path: 'car.model_year' },
      { field: 'engineType', value: query.engineType, path: 'car.engine_type' },
      {
        field: 'engineCapacity',
        value: query.engineCapacity,
        path: 'car.engine_capacity',
      },
    ];

    const getDistinctWithCount = async (
      column: string,
      nameColumn?: string,
      imageColumn?: string,
    ): Promise<
      Array<{ id: string; name: string; count: number; image?: string }>
    > => {
      const subQb = this.carsRepository
        .createQueryBuilder('car')
        .leftJoin('car.brand', 'brand')
        .leftJoin('car.type', 'type')
        .leftJoin('car.category', 'category')
        .where('car.is_active = :isActive', { isActive: true }); // Only active cars

      // Apply all filters except the one for the current column
      eqFilters.forEach(({ field, value, path }) => {
        if (!!value && column !== path) {
          subQb.andWhere(`${path} = :${field}`, { [field]: value });
        }
      });

      // Build select and group by clauses
      const selectCols = [`${column} as value`, `COUNT(*) as count`];
      const groupByCols = [column];

      if (nameColumn) {
        selectCols.push(`${nameColumn} as name`);
        groupByCols.push(nameColumn);
      }
      if (imageColumn) {
        selectCols.push(`${imageColumn} as image`);
        groupByCols.push(imageColumn);
      }

      // Apply GROUP BY for all selected columns
      groupByCols.forEach((col, index) => {
        if (index === 0) {
          subQb.groupBy(col);
        } else {
          subQb.addGroupBy(col);
        }
      });

      const rows = await subQb.select(selectCols).getRawMany();

      return rows
        .filter((row) => row.value !== null)
        .map((row) => ({
          id: String(row.value),
          name: String(row.name || row.value),
          count: Number(row.count),
          ...(row.image ? { image: row.image } : {}),
        }));
    };

    // Get all filter options in parallel
    const [
      brands,
      types,
      categories,
      models,
      subModels,
      modelYears,
      rawTransmissions,
      colors,
      engineTypes,
      rawEngineCapacities,
    ] = await Promise.all([
      getDistinctWithCount('brand.id', 'brand.name', 'brand.image'),
      getDistinctWithCount('type.id', 'type.name', 'type.image'),
      getDistinctWithCount('category.id', 'category.name'),
      getDistinctWithCount('car.model'),
      getDistinctWithCount('car.sub_model'),
      getDistinctWithCount('car.model_year'),
      getDistinctWithCount('car.transmission'),
      getDistinctWithCount('car.color'),
      getDistinctWithCount('car.engine_type'),
      getDistinctWithCount('car.engine_capacity'),
    ]);

    const transmissions = rawTransmissions.map((transmission) => ({
      ...transmission,
      name:
        TRANSMISSION_TRANSLATIONS[transmission.id as Transmission] ||
        transmission.id,
    }));

    const engineCapacities = rawEngineCapacities
      .map((ec) => ({
        ...ec,
        name: `${ec.id} CC`,
      }))
      .sort((a, b) => Number(a.id) - Number(b.id));

    return {
      brands,
      types,
      categories,
      models,
      subModels,
      modelYears,
      transmissions,
      colors,
      engineTypes,
      engineCapacities,
    };
  }
}
