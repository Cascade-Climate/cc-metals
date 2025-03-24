import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface CalculationParams {
  element: string;
  feedstock_type: string;
  application_rates: number[];
  soil_depth_min?: number;
  soil_depth_max?: number;
}

export interface CalculationResult {
  distributions: {
    bin_centers: number[];
    feedstock: number[];
    soil: number[];
  };
  concentrations: Record<string, number[]>;
  thresholds: number[] | null;
  threshold_agencies: string[] | null;
  statistics: Record<string, number>;
}

export async function getElements(): Promise<string[]> {
  const response = await axios.get(`${API_BASE_URL}/elements`);
  return response.data.elements;
}

export async function calculateConcentrations(
  params: CalculationParams
): Promise<CalculationResult> {
  const response = await axios.post(`${API_BASE_URL}/calculate`, params);
  return response.data;
}