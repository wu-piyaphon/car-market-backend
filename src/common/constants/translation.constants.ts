import { EngineType } from '@/common/enums/engine-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';

export const COLOR_TRANSLATIONS: { [key: string]: string } = {
  WHITE: 'ขาว',
  BLACK: 'ดำ',
  GRAY: 'เทา',
  SILVER: 'เงิน',
  BROWN: 'น้ำตาล',
  RED: 'แดง',
  DARK_BLUE: 'น้ำเงิน',
  GOLD: 'ทอง',
  BLUE: 'ฟ้า',
  GREEN: 'เขียว',
  ORANGE: 'ส้ม',
  YELLOW: 'เหลือง',
  PURPLE: 'ม่วง',
  CREAM: 'ครีม',
  PINK: 'ชมพู',
  OTHER: 'อื่นๆ',
} as const;

export const TRANSMISSION_TRANSLATIONS: {
  [key in Transmission]: string;
} = {
  AUTOMATIC: 'เกียร์อัตโนมัติ',
  MANUAL: 'เกียร์ธรรมดา',
};

export const ENGINE_TYPE_TRANSLATIONS: {
  [key in EngineType]: string;
} = {
  DIESEL: 'ดีเซล',
  GASOLINE: 'เบนซิน',
  ELECTRIC: 'ไฟฟ้า',
  HYBRID: 'ไฮบริด',
  LPG: 'LPG',
  CNG: 'CNG',
};

export const CAR_CATEGORY_TRANSLATIONS: { [key: string]: string } = {
  NEW: 'มาใหม่',
};

export const CAR_TYPE_TRANSLATIONS: { [key: string]: string } = {
  SUV: 'SUV',
  SEDAN: 'เก๋ง',
  PICKUP: 'กระบะ',
};
