export type EcoScore = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ScanResponse {
  productName: string;
  image: string;
  carbonFootprint: string;
  ecoScore: EcoScore;
  impact: string;
  alternatives: string[];
}

export type RootStackParamList = {
  Scanner: undefined;
  Result: {
    barcode: string;
  };
};
