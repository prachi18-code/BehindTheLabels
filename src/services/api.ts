import axios from 'axios';

import type { ScanResponse } from '../types';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchScanResult = async (barcode: string): Promise<ScanResponse> => {
  const response = await api.post<ScanResponse>('/api/scan', { barcode });
  return response.data;
};
