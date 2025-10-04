import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { CarFilterResponseDto } from '../dtos/car-filter-response.dto';
import { Car } from '../entities/car.entity';
import {
  TRANSMISSION_TRANSLATIONS,
  COLOR_TRANSLATIONS,
  ENGINE_TYPE_TRANSLATIONS,
  CAR_CATEGORY_TRANSLATIONS,
  CAR_TYPE_TRANSLATIONS,
} from '@/common/constants/translation.constants';
import { Transmission } from '@/common/enums/transmission.enum';
import { EngineType } from '@/common/enums/engine-type.enum';

@Injectable()
export class CarFilterService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
  ) {}

  async getFilters(query: CarFilterQueryDto): Promise<CarFilterResponseDto> {
    const eqFilters = [
      { field: 'type', value: query.type, path: 'type.name' },
      { field: 'brand', value: query.brand, path: 'brand.name' },
      { field: 'category', value: query.category, path: 'category.name' },
      { field: 'model', value: query.model, path: 'car.model' },
      { field: 'subModel', value: query.subModel, path: 'car.subModel' },
      {
        field: 'transmission',
        value: query.transmission,
        path: 'car.transmission',
      },
      { field: 'color', value: query.color, path: 'car.color' },
      { field: 'modelYear', value: query.modelYear, path: 'car.modelYear' },
      { field: 'engineType', value: query.engineType, path: 'car.engineType' },
      {
        field: 'engineCapacity',
        value: query.engineCapacity,
        path: 'car.engineCapacity',
      },
    ];

    const getDistinctWithCount = async (
      column: string,
      imageColumn?: string,
    ): Promise<
      Array<{ id: string; name: string; count: number; image?: string }>
    > => {
      const subQb = this.carsRepository
        .createQueryBuilder('car')
        .leftJoin('car.brand', 'brand')
        .leftJoin('car.type', 'type')
        .leftJoin('car.category', 'category');

      // Apply all filters except the one for the current column
      eqFilters.forEach(({ field, value, path }) => {
        if (!!value && column !== path) {
          subQb.andWhere(`${path} = :${field}`, { [field]: value });
        }
      });

      // Build select and group by clauses
      const selectCols = [`${column} as value`, `COUNT(*) as count`];
      if (imageColumn) {
        selectCols.push(`${imageColumn} as image`);
        subQb.groupBy('value').addGroupBy(imageColumn);
      } else {
        subQb.groupBy(column);
      }

      const rows = await subQb.select(selectCols).getRawMany();

      return rows
        .filter((row) => row.value !== null)
        .map((row) => ({
          id: String(row.value),
          name: String(row.value),
          count: Number(row.count),
          ...(row.image ? { image: row.image } : {}),
        }));
    };

    // Get all filter options in parallel
    const [
      brands,
      rawTypes,
      rawCategories,
      models,
      subModels,
      modelYears,
      rawTransmissions,
      rawColors,
      rawEngineTypes,
      rawEngineCapacities,
    ] = await Promise.all([
      getDistinctWithCount('brand.name', 'brand.image'),
      getDistinctWithCount('type.name', 'type.image'),
      getDistinctWithCount('category.name'),
      getDistinctWithCount('car.model'),
      getDistinctWithCount('car.subModel'),
      getDistinctWithCount('car.modelYear'),
      getDistinctWithCount('car.transmission'),
      getDistinctWithCount('car.color'),
      getDistinctWithCount('car.engineType'),
      getDistinctWithCount('car.engineCapacity'),
    ]);

    // Map keys to display names
    const types = rawTypes.map((type) => ({
      ...type,
      name: CAR_TYPE_TRANSLATIONS[type.id] || type.id,
    }));

    const categories = rawCategories.map((category) => ({
      ...category,
      name: CAR_CATEGORY_TRANSLATIONS[category.id] || category.id,
    }));

    const colors = rawColors.map((color) => ({
      ...color,
      name: COLOR_TRANSLATIONS[color.id] || color.id,
    }));

    const transmissions = rawTransmissions.map((transmission) => ({
      ...transmission,
      name:
        TRANSMISSION_TRANSLATIONS[transmission.id as Transmission] ||
        transmission.id,
    }));

    const engineTypes = rawEngineTypes.map((engineType) => ({
      ...engineType,
      name:
        ENGINE_TYPE_TRANSLATIONS[engineType.id as EngineType] || engineType.id,
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
