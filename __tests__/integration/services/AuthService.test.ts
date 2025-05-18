import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, LoginData, RegisterData, User } from '../../../services/authService';
import { apiClient } from '../../../services/apiClient';
import { API_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';

// Jest nadal wymaga mockowania AsyncStorage, ponieważ faktyczne zapisy w pamięci
// nie są możliwe w środowisku testowym
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiRemove: jest.fn(),
  removeItem: jest.fn(),
}));

// Dane testowe - użyj rzeczywistych danych testowych z Twojego API
const TEST_USER = {
    firstname: 'Testowy',
    email: 'test@test.pl',
    password: 'Test@1234',
};

describe('AuthService - Testy integracyjne', () => {
  // Token będzie przechowywany między testami, aby umożliwić testy zależne 
  // (np. najpierw logowanie, potem operacje wymagające zalogowania)
  let authToken: string | null = null;
  let testUserId: string | null = null;

  // Zrób setup przed wszystkimi testami
  beforeAll(async () => {
    // Wyczyść potencjalne pozostałości z poprzednich uruchomień testów
    await AsyncStorage.multiRemove([
      STORAGE_CONFIG.USER_TOKEN_KEY,
      STORAGE_CONFIG.USER_DATA_KEY
    ]);
    
    console.log('Rozpoczęcie testów integracyjnych AuthService');
  });

  // Zrób cleanup po wszystkich testach
  afterAll(async () => {
    console.log('Zakończenie testów integracyjnych AuthService');
    
    // Jeśli udało się zarejestrować testowego użytkownika, możemy go tutaj usunąć
    // Uwaga: to wymaga implementacji usuwania konta w API
    if (authToken && testUserId) {
      try {
        // Ten endpoint może nie istnieć w Twoim API - dostosuj odpowiednio
        // await apiClient.delete(`${API_CONFIG.ENDPOINTS.USER.DELETE}/${testUserId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${authToken}`
        //   }
        // });
        console.log('Usunięto testowego użytkownika');
      } catch (error) {
        console.warn('Nie można usunąć testowego użytkownika:', error);
      }
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Grupa testów dla rejestracji
  describe('Rejestracja', () => {
    it('powinien zarejestrować nowego użytkownika', async () => {
      // Przygotowanie danych testowych
      const registerData: RegisterData = {
        firstname: TEST_USER.firstname,
        email: TEST_USER.email,
        password: TEST_USER.password,
        repeatPassword: TEST_USER.password,
        acceptPrivacyPolicy: true
      };
      
      // Wywołanie metody rejestracji
      const result = await AuthService.register(registerData);
      
      // Asercje
      expect(result).toBe(true);
      
      // Daj API trochę czasu na przetworzenie rejestracji
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    }, 10000); // Zwiększony timeout dla zapytania sieciowego
  });

  // Grupa testów dla logowania
  describe('Logowanie', () => {
    it('powinien zalogować użytkownika pomyślnie', async () => {
      // Przygotowanie danych logowania
      const loginData: LoginData = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        remember_me: false
      };
      
      // Symulacja zachowania AsyncStorage.setItem aby przechwycić token
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        async (key: string, value: string) => {
          if (key === STORAGE_CONFIG.USER_TOKEN_KEY) {
            authToken = value;
          }
          return Promise.resolve();
        }
      );
      
      // Wywołanie metody logowania
      const result = await AuthService.login(loginData);
      
      // Asercje
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(authToken).not.toBeNull();
      
      console.log('Zalogowano pomyślnie, token:', authToken ? 'Otrzymano' : 'Brak');
    }, 10000); // Zwiększony timeout dla zapytania sieciowego
  });

  // testuje pobranie danych usera po zalogowaniu
  describe('Pobieranie danych użytkownika po zalogowaniu', () => {
    it('powinien pobrać dane użytkownika po zalogowaniu', async () => {
        // Użyj przechwycony token z testu logowania
        const loginData: LoginData = {
            email: TEST_USER.email,
            password: TEST_USER.password,
            remember_me: false
        };

        // Symulacja zachowania AsyncStorage.setItem aby przechwycić token
        (AsyncStorage.setItem as jest.Mock).mockImplementation(
            async (key: string, value: string) => {
                if (key === STORAGE_CONFIG.USER_TOKEN_KEY) {
                    authToken = value;
                }
                return Promise.resolve();
            }
        );
        (AsyncStorage.getItem as jest.Mock).mockImplementation(
            async (key: string) => {
                if (key === STORAGE_CONFIG.USER_TOKEN_KEY) {
                    return authToken;
                }
                return null;
            }
        );

        // Wywołanie metody logowania
        const result = await AuthService.login(loginData);

        
        // Wywołanie metody pobierania danych użytkownika
        const user = await AuthService.loadCurrentUser();
        
        // Asercje
        expect(user).not.toBeNull();
        if (user) {
            expect(user.email).toBe(TEST_USER.email);
            console.log('Pobrano dane użytkownika po zalogowaniu:', {
            id: user.id,
            email: user.email,
            firstname: user.firstname
            });
        }
        }
    , 10000);
  });

  describe( 'Register', () => {
    it('powinien zarejestrować nowego użytkownika', async () => {
      // Przygotowanie danych testowych
      const registerData: RegisterData = {
        firstname: TEST_USER.firstname,
        email: TEST_USER.email,
        password: TEST_USER.password,
        repeatPassword: TEST_USER.password,
        acceptPrivacyPolicy: true
      };
      
      // Wywołanie metody rejestracji
      const result = await AuthService.register(registerData);
      
      // Asercje
      expect(result).toBe(true);
    }, 10000); // Zwiększony timeout dla zapytania sieciowego
  })
});