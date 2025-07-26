import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export function generateCarSlug(car: CreateCarDto) {
  const slug = slugify(
    `${car.model} ${car.subModel} ${car.modelYear} ${uuidv4()}`,
    {
      lower: true,
    },
  );
  return slug;
}
