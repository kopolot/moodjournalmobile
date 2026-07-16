import MockAdapter from 'axios-mock-adapter';

declare global {
  // eslint-disable-next-line no-var
  var __MOOD_TEST_AXIOS__: import('axios').AxiosInstance;
}

jest.mock('axios', () => {
  const actual = jest.requireActual<typeof import('axios')>('axios');
  const instance = actual.default.create();
  global.__MOOD_TEST_AXIOS__ = instance;

  return {
    __esModule: true,
    ...actual,
    default: Object.assign(jest.fn((config) => instance(config)), actual.default, {
      create: jest.fn(() => instance),
    }),
  };
});

export function getHttpMock(): MockAdapter {
  return new MockAdapter(global.__MOOD_TEST_AXIOS__, { onNoMatch: 'throwException' });
}
