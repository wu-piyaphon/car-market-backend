import {
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
} from '@/common/constants/file.constants';
import { FileValidationPipe } from '@/common/pipes';

export const ImageFileValidationPipe = new FileValidationPipe({
  maxSize: MAX_IMAGE_SIZE,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
});

export const OptionalImageFileValidationPipe = new FileValidationPipe({
  maxSize: MAX_IMAGE_SIZE,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  optional: true,
});

export const PdfFileValidationPipe = new FileValidationPipe({
  maxSize: MAX_PDF_SIZE,
  allowedMimeTypes: ['application/pdf'],
});
