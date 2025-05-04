import env from '../../env';

export const API_BASE_URL = env.apiUrl;

export const API_ENDPOINTS = {
  SEARCH_FOOD: '/nutrition/search',
  SEARCH_BY_BARCODE: '/nutrition/barcode',
  ANALYZE_IMAGE: '/nutrition/image',
};

export const FEATURES = {
  enableNative: env.enableNativeFeatures,
}; 