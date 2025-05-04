import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { NutritionResponse } from '../types/nutrition';
import { RecognitionResponse, Prediction } from '../types/predictions';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Manejador genérico de errores
const handleApiError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Server Response Error:', error.response.status, error.response.data);
      return {
        status: 'error',
        message: `Error ${error.response.status}: ${error.response.data?.detail || error.response.data?.message || 'Server error'}`,
      };
    } else if (error.request) {
      console.error('Network Error: No response received');
      return {
        status: 'error',
        message: 'Could not connect to the server. Check network and server status.',
      };
    }
  }
  return {
    status: 'error',
    message: `An unknown error occurred during ${context}.`,
  };
};

// --- Búsqueda de Alimentos ---
export const searchFoodByName = async (foodName: string): Promise<NutritionResponse> => {
  const context = 'searchFoodByName';
  try {
    console.log(`Searching: ${foodName} at ${API_BASE_URL}/nutrition/search/${encodeURIComponent(foodName)}`);
    const response = await apiClient.get(`/nutrition/search/${encodeURIComponent(foodName)}`);
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, context) as NutritionResponse;
  }
};

export const searchFoodByBarcode = async (barcode: string): Promise<NutritionResponse> => {
  const context = 'searchFoodByBarcode';
  try {
    const response = await apiClient.get(`/nutrition/barcode/${barcode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, context) as NutritionResponse;
  }
};

// --- Reconocimiento de Imágenes ---
export const recognizeImage = async (imageUri: string): Promise<RecognitionResponse> => {
  const context = 'recognizeImage';
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: `photo_${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);

  try {
    const response = await apiClient.post('/image/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, context) as RecognitionResponse;
  }
};

export const recognizeAndSaveImage = async (imageUri: string, userId: string): Promise<RecognitionResponse> => {
  const context = 'recognizeAndSaveImage';
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: `photo_${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);

  try {
    const response = await apiClient.post('/image/recognize-and-save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Id': userId,
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, context) as RecognitionResponse;
  }
};

// --- Endpoints de Predicciones ---
export const getUserPredictions = async (userId: string): Promise<{ status: string; predictions?: Prediction[]; message?: string }> => {
  const context = 'getUserPredictions';
  try {
    const response = await apiClient.get(`/predictions/${userId}`);
    return { status: 'success', predictions: response.data };
  } catch (error) {
    return handleApiError(error, context);
  }
};

export const getPredictionDetails = async (userId: string, predictionId: string): Promise<{ status: string; prediction?: Prediction; message?: string }> => {
  const context = 'getPredictionDetails';
  try {
    const response = await apiClient.get(`/predictions/${userId}/${predictionId}`);
    return { status: 'success', prediction: response.data };
  } catch (error) {
    return handleApiError(error, context);
  }
};

export const deletePrediction = async (userId: string, predictionId: string): Promise<{ status: string; message?: string }> => {
  const context = 'deletePrediction';
  try {
    const response = await apiClient.delete(`/predictions/${userId}/${predictionId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, context);
  }
};