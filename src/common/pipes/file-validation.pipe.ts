import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

interface FileValidationOptions {
  maxSize: number;
  allowedMimeTypes: string[];
  optional?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions) {}

  transform(value: Express.Multer.File | Express.Multer.File[]) {
    const files = Array.isArray(value) ? value : [value];

    if (!files || files.length === 0 || !files[0]) {
      if (this.options.optional) {
        return undefined;
      } else {
        throw new BadRequestException('No files provided');
      }
    }

    for (const file of files) {
      if (file.size > this.options.maxSize) {
        throw new BadRequestException(
          `File size exceeds ${this.options.maxSize} bytes`,
        );
      }
      if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File type ${file.mimetype} is not supported. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
        );
      }
    }
    return value;
  }
}
