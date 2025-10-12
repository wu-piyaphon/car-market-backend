import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ImportsService } from './imports.service';

@ApiTags('Imports')
@Controller('imports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('cars')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'csvFile', maxCount: 1 },
      { name: 'defaultImageFile', maxCount: 1 },
    ]),
  )
  async importCars(
    @UploadedFiles()
    files: {
      csvFile?: Express.Multer.File[];
      defaultImageFile?: Express.Multer.File[];
    },
    @User() user: UserPayload,
  ) {
    const csvFile = files.csvFile?.[0];
    const defaultImageFile = files.defaultImageFile?.[0];

    // Validate CSV file upload
    if (!csvFile) {
      throw new BadRequestException('CSV file is required');
    }

    // Validate file type
    if (!csvFile.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV file');
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (csvFile.size > maxSize) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    // Validate file content
    if (!csvFile.buffer || csvFile.buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }

    // Validate default image upload
    if (!defaultImageFile) {
      throw new BadRequestException('Default image file is required');
    }

    try {
      const userId = user.id;
      const result = await this.importsService.importCars(
        csvFile.buffer,
        defaultImageFile,
        userId,
      );

      return {
        message: 'Import completed successfully',
        ...result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
