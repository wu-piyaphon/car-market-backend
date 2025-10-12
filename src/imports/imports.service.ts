import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CarTypesService } from '@/car-types/car-types.service';
import { CarsService } from '@/cars/cars.service';
import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { SalesRequestType } from '@/common/enums/request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as Papa from 'papaparse';

interface CsvCarRow {
  typeId: string;
  brandId: string;
  model: string;
  subModel: string;
  transmission: string;
  modelYear: string;
  color: string;
  engineType: string;
  engineCapacity: string;
  mileage?: string;
  price: string;
  originalLicensePlate?: string;
  currentLicensePlate: string;
}

interface ImportResult {
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}

@Injectable()
export class ImportsService {
  private readonly logger = new Logger(ImportsService.name);

  constructor(
    private readonly carsService: CarsService,
    private readonly carBrandsService: CarBrandsService,
    private readonly carTypesService: CarTypesService,
  ) {}

  async importCars(
    csvBuffer: Buffer,
    defaultImage: Express.Multer.File,
    userId: string,
  ): Promise<ImportResult> {
    const csvText = csvBuffer.toString('utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse<CsvCarRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Transform headers to match our expected format
          const headerMap: Record<string, string> = {
            type_id: 'typeId',
            brand_id: 'brandId',
            model_year: 'modelYear',
            engine_type: 'engineType',
            engine_capacity: 'engineCapacity',
            original_license_plate: 'originalLicensePlate',
            current_license_plate: 'currentLicensePlate',
          };
          return headerMap[header.toLowerCase()] || header;
        },
        complete: async (results) => {
          try {
            const importResult = await this.processRows(
              results.data,
              defaultImage,
              userId,
            );
            resolve(importResult);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(
            new BadRequestException(`CSV parsing failed: ${error.message}`),
          );
        },
      });
    });
  }

  private async processRows(
    rows: CsvCarRow[],
    defaultImage: Express.Multer.File,
    userId: string,
  ): Promise<ImportResult> {
    const result: ImportResult = {
      totalRows: rows.length,
      successfulImports: 0,
      failedImports: 0,
      errors: [],
    };

    this.logger.log(`Starting import of ${rows.length} cars`);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1; // 1-based for user-friendly error reporting

      try {
        // Validate and transform the row data
        const carDto = await this.transformRowToCarDto(row);

        // Create the car (without files for CSV import)
        await this.carsService.create(carDto, [defaultImage], userId);

        result.successfulImports++;
        this.logger.debug(`Successfully imported car at row ${rowNumber}`);
      } catch (error) {
        result.failedImports++;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        result.errors.push({
          row: rowNumber,
          data: row,
          error: errorMessage,
        });

        this.logger.warn(
          `Failed to import car at row ${rowNumber}: ${errorMessage}`,
        );
      }
    }

    this.logger.log(
      `Import completed: ${result.successfulImports} successful, ${result.failedImports} failed`,
    );
    return result;
  }

  private async transformRowToCarDto(row: CsvCarRow): Promise<CreateCarDto> {
    // Validate required fields
    this.validateRequiredFields(row);

    // Validate and transform enums
    const typeId = this.validateTypeId(row.typeId);
    const transmission = this.validateTransmission(row.transmission);

    // Validate that brand and type exist
    await this.validateBrandExists(row.brandId);
    await this.validateTypeExists(typeId);

    // Transform the row to CreateCarDto
    const carDto: CreateCarDto = {
      typeId,
      brandId: row.brandId.toUpperCase(),
      categoryId: null,
      model: row.model.trim(),
      subModel: row.subModel.trim(),
      transmission,
      modelYear: parseInt(row.modelYear, 10),
      color: row.color.trim(),
      engineType: row.engineType,
      engineCapacity: this.parseNumber(row.engineCapacity),
      mileage: row.mileage ? this.parseNumber(row.mileage) : undefined,
      price: this.parseNumber(row.price),
      originalLicensePlate: row.originalLicensePlate?.trim() || undefined,
      currentLicensePlate: row.currentLicensePlate.trim(),
      salesType: SalesRequestType.OWNER,
      isActive: true,
    };

    this.validateTransformedData(carDto);
    return carDto;
  }

  private validateRequiredFields(row: CsvCarRow): void {
    const requiredFields = [
      'typeId',
      'brandId',
      'model',
      'subModel',
      'transmission',
      'modelYear',
      'color',
      'engineType',
      'engineCapacity',
      'price',
      'currentLicensePlate',
    ];

    for (const field of requiredFields) {
      if (!row[field] || row[field].toString().trim() === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  private validateTypeId(typeId: string): string {
    const typeIdMap = {
      เก๋ง: 'SEDAN',
      SUV: 'SUV',
      รถตู้: 'VAN',
      กระบะ: 'PICKUP',
    };

    if (!typeIdMap[typeId]) {
      throw new Error(
        `Invalid typeId: ${typeId}. Must be one of: ${Object.keys(typeIdMap).join(', ')}`,
      );
    }

    return typeIdMap[typeId];
  }

  private validateTransmission(transmission: string): Transmission {
    if (!['A/T', 'M/T'].includes(transmission)) {
      throw new Error(
        `Invalid transmission: ${transmission}. Must be one of: ${Object.values(Transmission).join(', ')}`,
      );
    }
    return transmission === 'A/T'
      ? Transmission.AUTOMATIC
      : Transmission.MANUAL;
  }

  private async validateBrandExists(brandId: string): Promise<void> {
    try {
      await this.carBrandsService.findOne(brandId.toUpperCase());
    } catch {
      throw new Error(`Car brand with ID '${brandId}' not found`);
    }
  }

  private async validateTypeExists(typeId: string): Promise<void> {
    try {
      await this.carTypesService.findOne(typeId.toUpperCase());
    } catch {
      throw new Error(`Car type with ID '${typeId}' not found`);
    }
  }

  private validateTransformedData(carDto: CreateCarDto): void {
    // Validate numeric fields
    if (
      isNaN(carDto.modelYear) ||
      carDto.modelYear < 1900 ||
      carDto.modelYear > new Date().getFullYear() + 1
    ) {
      throw new Error(`Invalid model year: ${carDto.modelYear}`);
    }

    if (isNaN(carDto.engineCapacity) || carDto.engineCapacity <= 0) {
      throw new Error(`Invalid engine capacity: ${carDto.engineCapacity}`);
    }

    if (isNaN(carDto.price) || carDto.price <= 0) {
      throw new Error(`Invalid price: ${carDto.price}`);
    }

    if (
      carDto.mileage !== undefined &&
      (isNaN(carDto.mileage) || carDto.mileage < 0)
    ) {
      throw new Error(`Invalid mileage: ${carDto.mileage}`);
    }
  }

  /**
   * Parse a number string using Intl.NumberFormat for better reliability
   */
  private parseNumber(value: string): number {
    if (!value || typeof value !== 'string') {
      throw new Error(`Invalid number format: ${value}`);
    }

    const cleanValue = value.trim();
    const numberWithoutCommas = cleanValue.replace(/,/g, '');
    const result = Number(numberWithoutCommas);

    if (isNaN(result)) {
      throw new Error(`Unable to parse number: ${value}`);
    }

    return result;
  }
}
