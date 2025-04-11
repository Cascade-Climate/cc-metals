import { CustomCalculationParams } from '@/services/metalsService';

const defaultParameters: CustomCalculationParams = {
  soil_conc: 15,
  soil_conc_sd: 3,
  soil_d: 0.15,
  soil_d_err: 0.02,
  dbd: 1.3,
  dbd_err: 0.15,
  feed_conc: 20,
  feed_conc_sd: 2,
  application_rate: 20,
  element: '',
  feedstock_type: '',
};

export default defaultParameters;
