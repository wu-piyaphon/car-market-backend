import { PartialType } from '@nestjs/swagger';
import { CreateCarTransmissionDto } from './create-car-transmission.dto';

export class UpdateCarTransmissionDto extends PartialType(
  CreateCarTransmissionDto,
) {}
