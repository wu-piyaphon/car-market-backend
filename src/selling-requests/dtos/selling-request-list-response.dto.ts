import {
  SalesRequestStatus,
  SalesRequestType,
} from '@/common/enums/sales-request.enum';
import { SellingRequest } from '@/selling-requests/entities/selling-request.entity';

export class SellingRequestListResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phoneNumber: string;
  note: string;
  createdAt: Date;
  type: SalesRequestType;
  status: SalesRequestStatus;

  constructor(sellingRequest: SellingRequest) {
    this.id = sellingRequest.id;
    this.firstName = sellingRequest.firstName;
    this.lastName = sellingRequest.lastName;
    this.nickname = sellingRequest.nickname;
    this.phoneNumber = sellingRequest.phoneNumber;
    this.note = sellingRequest.note;
    this.type = sellingRequest.type;
    this.createdAt = sellingRequest.createdAt;
    this.status = sellingRequest.status;
  }
}
