import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/services/apiClient';
import { STORAGE_CONFIG } from '@/config/appConfig';

describe('apiClient — auth guard', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns UNAUTHORIZED when auth is required but token is missing', async () => {
    const response = await apiClient.get('/user/get');

    expect(response.success).toBe(false);
    expect(response.error).toBe('UNAUTHORIZED_HTTP_EXCEPTION');
    expect(response.message).toEqual(['user.session.not_found']);
  });
});
