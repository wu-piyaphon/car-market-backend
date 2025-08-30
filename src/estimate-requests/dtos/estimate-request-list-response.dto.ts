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
  images: string[];
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
    this.images = estimateRequest.images;
    this.note = estimateRequest.note;
    this.createdAt = estimateRequest.createdAt;
    this.status = estimateRequest.status;
  }
}
