import { createIdempotencyKey } from '@/utils/idempotency';

describe('createIdempotencyKey', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses crypto.randomUUID when available', () => {
    const uuid = '11111111-2222-4333-8444-555555555555';
    jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(uuid);

    expect(createIdempotencyKey()).toBe(uuid);
  });

  it('falls back to idem-prefixed key when crypto is missing', () => {
    const original = globalThis.crypto;
    // @ts-expect-error test override
    globalThis.crypto = undefined;

    const key = createIdempotencyKey();

    expect(key).toMatch(/^idem-\d+-[a-z0-9]+$/);

    globalThis.crypto = original;
  });
});
