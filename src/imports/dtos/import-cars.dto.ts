import { ApiProperty } from '@nestjs/swagger';

export class ImportCarsDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file containing car data',
    example: 'cars.csv',
  })
  file: Express.Multer.File;
}

export class ImportResultDto {
  @ApiProperty({
    description: 'Result message',
    example: 'Import completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Total number of rows processed',
    example: 100,
  })
  totalRows: number;

  @ApiProperty({
    description: 'Number of cars successfully imported',
    example: 95,
  })
  successfulImports: number;

  @ApiProperty({
    description: 'Number of cars that failed to import',
    example: 5,
  })
  failedImports: number;

  @ApiProperty({
    description: 'Array of errors for failed imports',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        row: {
          type: 'number',
          description: 'Row number where error occurred',
          example: 3,
        },
        data: {
          type: 'object',
          description: 'The data that failed to import',
          example: { model: 'Civic', brand: 'Honda' },
        },
        error: {
          type: 'string',
          description: 'Error message',
          example: 'Missing required field: currentLicensePlate',
        },
      },
    },
  })
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}
