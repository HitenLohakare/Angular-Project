export interface ApiError {
  message?: string;
  code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: ApiError;
  data?: T; // Generic type to allow any kind of data
}
