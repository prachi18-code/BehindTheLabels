export type EcoScore = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ScanResponse {
  productName: string;
  image: string;
  carbonFootprint: string;
  ecoScore: EcoScore;
  impact: string;
  nutritionStatus?: 'healthy' | 'unhealthy';
  alternatives: string[];
  alternativesSource?: 'ai' | 'category-fallback' | 'default-fallback' | 'none';
  sugarLevel: string | null;
  addedSugarLevel?: number | null;
  saturatedFatLevel: string | null;
  novaGroup: string | null;
  nutriScore?: string | null;
  smartSummary: string;
}

export type RootStackParamList = {
  Scanner: undefined;
  Result: {
    barcode: string;
  };
};
