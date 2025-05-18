import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Typy odpowiedzi API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: Array<T>;
  error: string;
  message?: Array<string>;
}

/**
 * Opcje dla żądań API
 */
export interface ApiRequestOptions {
  requiresAuth?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Klasa klienta API
 * Obsługuje żądania HTTP do backend API
 */
class ApiClient {
  private axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  /**
   * Podstawowa metoda do wykonywania żądań HTTP
   */
  private async fetchWithAuth<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data: Array<any>,
    options: ApiRequestOptions = { requiresAuth: true }
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint;
      
      // Przygotowanie nagłówków
      let headers: Record<string, string> = {
        ...options.headers,
      };
      
      // Dodanie tokenu autoryzacji, jeśli wymagane
      if (options.requiresAuth) {
        const token = await AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Brak tokena, a wymagana autoryzacja
          return {
            success: false,
            error: 'UNAUTHORIZED_HTTP_EXCEPTION',
            message: ['user.session.not_found'],
            data: [],
          };
        }
      }
      
      // Konfiguracja żądania axios
      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        headers,
        timeout: options.timeout || API_CONFIG.TIMEOUT
      };
      
      // Dodanie danych do żądania, jeśli zostały przekazane
      if (data && method !== 'GET') {
        axiosConfig.data = data;
      }
      
      try {
        // Wykonanie żądania z axios
        const response: AxiosResponse = await this.axiosInstance(axiosConfig);
        
        // Przetwarzanie odpowiedzi
        return {
          success: response.data.success,
          data: response.data.data,
          error: response.data.error,
          message: response.data.message,
        };
      } catch (axiosError) {
        // Obsługa błędów axios
        const error = axiosError as AxiosError;
        
        if (error.response) {
          // Serwer zwrócił odpowiedź z kodem błędu
          const responseData = error.response.data as any;
          return {
            success: false,
            data: responseData.data || [],
            error: responseData.error || 'API_ERROR',
            message: responseData.message || ['error'],
          };
        } else if (error.request) {
          // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi
          console.error('No response received:', error.request);
          throw error;
        } else {
          console.error('Error setting up request:', error.message);
          throw error;
        }
      }
      
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Request Failed',
        message: [error instanceof Error ? error.message : 'Unknown error'],
        data: [],
      };
    }
  }
  
  /**
   * Wykonuje żądanie GET
   */
  async get<T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, 'GET', [], options);
  }
  
  /**
   * Wykonuje żądanie POST
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, 'POST', data, options);
  }
  
  /**
   * Wykonuje żądanie PUT
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, 'PUT', data, options);
  }
  
  /**
   * Wykonuje żądanie PATCH
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, 'PATCH', data, options);
  }
  
  /**
   * Wykonuje żądanie DELETE
   */
  async delete<T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, 'DELETE', [], options);
  }
}

// Eksportuj pojedynczą instancję klienta API
export const apiClient = new ApiClient();