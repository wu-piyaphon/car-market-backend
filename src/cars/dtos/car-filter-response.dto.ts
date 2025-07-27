export type FilterOption = {
  value: string;
  count: number;
};

export class CarFilterResponseDto {
  brands: FilterOption[];
  categories: FilterOption[];
  types: FilterOption[];
  models: FilterOption[];
  subModels: FilterOption[];
  modelYears: FilterOption[];
  transmissions: FilterOption[];
  colors: FilterOption[];
  engineTypes: FilterOption[];
}
