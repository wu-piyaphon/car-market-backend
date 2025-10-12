import { Transmission } from '@/common/enums/transmission.enum';

export const TRANSMISSION_TRANSLATIONS: {
  [key in Transmission]: string;
} = {
  AUTOMATIC: 'เกียร์อัตโนมัติ',
  MANUAL: 'เกียร์ธรรมดา',
};
