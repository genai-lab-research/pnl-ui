export interface SeedType {
  id: string;
  name: string;
  variety: string;
  supplier: string;
}

export interface SeedTypeList {
  total: number;
  results: SeedType[];
}