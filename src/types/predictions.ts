// Types for Image Recognition and Prediction History

export interface PredictionResult {
  class: string;
  confidence: number;
}

export interface RecognitionResponse {
  status: 'success' | 'error';
  message?: string;
  main_prediction?: PredictionResult;
  alternatives?: PredictionResult[];
  prediction_id?: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  food_class: string;
  confidence: number;
  timestamp: string;
  image_filename?: string;
} 