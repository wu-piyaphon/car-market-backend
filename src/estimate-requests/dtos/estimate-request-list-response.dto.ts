import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';
import { EstimateRequest } from '@/estimate-requests/entities/estimate-request.entity';

export class EstimateRequestListResponseDto {
  id: string;
  brand: string;
  model: string;
  modelYear: number;
  firstName: string;
  phoneNumber: string;
  thumbnail: string;
  note: string;
  createdAt: Date;
  type: SalesRequestType;
  status: RequestContactStatus;

  constructor(estimateRequest: EstimateRequest) {
    this.id = estimateRequest.id;
    this.brand = estimateRequest.brand.name;
    this.model = estimateRequest.model;
    this.modelYear = estimateRequest.modelYear;
    this.firstName = estimateRequest.firstName;
    this.phoneNumber = estimateRequest.phoneNumber;
    this.thumbnail = estimateRequest.images[0];
    this.note = estimateRequest.note;
    this.createdAt = estimateRequest.createdAt;
    this.status = estimateRequest.status;
  }
}
