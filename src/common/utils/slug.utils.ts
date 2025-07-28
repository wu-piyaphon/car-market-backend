import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { getTimestamp } from '@/common/utils/date.utils';
import slugify from 'slugify';

/**
 * Generates a URL-friendly slug for a car, e.g. "honda-civic-typeR-2025/17288606"
 * @param brand - Car brand
 * @param car - Car DTO
 * @returns Slug string for use in URLs
 */
export function generateCarSlug(brand: string, car: CreateCarDto) {
  const timestamp = getTimestamp();

  const parts = [brand, car.model, car.subModel, car.modelYear, timestamp]
    .filter(Boolean)
    .join('-');

  const slug = slugify(parts, { lower: true });
  return slug;
}
