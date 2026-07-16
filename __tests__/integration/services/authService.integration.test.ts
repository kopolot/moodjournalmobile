import '../helpers/setupHttpMock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHttpMock } from '../helpers/setupHttpMock';
import { API_CONFIG, STORAGE_CONFIG } from '@/config/appConfig';
import { AuthService } from '@/services/authService';
import { makeUser } from '../../testUtils/fixtures';

describe('AuthService — HTTP integration', () => {
  const httpMock = getHttpMock();

  beforeEach(async () => {
    httpMock.reset();
    await AsyncStorage.clear();
  });

  it('registers via POST /user/register', async () => {
    httpMock.onPost(API_CONFIG.ENDPOINTS.AUTH.REGISTER).reply(200, {
      success: true,
      data: {},
      error: '',
      message: ['user.register.success'],
    });

    const response = await AuthService.register({
      firstname: 'Anna',
      email: 'anna@example.com',
      password: 'Test@1234',
      repeatPassword: 'Test@1234',
      acceptPrivacyPolicy: true,
    });

    expect(response.success).toBe(true);
    expect(response.message).toContain('user.register.success');
  });

  it('logs in and stores jwt_token', async () => {
    httpMock.onPost(API_CONFIG.ENDPOINTS.AUTH.LOGIN).reply(200, {
      success: true,
      data: { jwt_token: 'jwt-integration' },
      error: '',
      message: [],
    });

    const response = await AuthService.login({
      email: 'anna@example.com',
      password: 'Test@1234',
      remember_me: false,
    });

    expect(response.success).toBe(true);
    await expect(AsyncStorage.getItem(STORAGE_CONFIG.USER_TOKEN_KEY)).resolves.toBe(
      'jwt-integration'
    );
  });

  it('loads profile with Bearer token after login', async () => {
    const user = makeUser();
    await AsyncStorage.setItem(STORAGE_CONFIG.USER_TOKEN_KEY, 'jwt-profile');

    httpMock.onGet(API_CONFIG.ENDPOINTS.USER.PROFILE).reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer jwt-profile');
      return [
        200,
        {
          success: true,
          data: user,
          error: '',
          message: [],
        },
      ];
    });

    const loaded = await AuthService.loadCurrentUser();

    expect(loaded).toEqual(user);
    const cached = await AsyncStorage.getItem(STORAGE_CONFIG.USER_DATA_KEY);
    expect(cached).toContain(user.email);
  });
});
