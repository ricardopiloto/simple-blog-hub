import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authStorage } from '@/auth/storage';
import { createUser } from './client';

describe('createUser', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    authStorage.setAuth('test-token', { id: 'a1', name: 'Admin', avatar: null, bio: null, is_admin: true }, 'u1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    authStorage.clear();
    fetchMock.mockReset();
  });

  it('sends email and author_name without password', async () => {
    const created = {
      id: 'user-1',
      email: 'novo@example.com',
      author_id: 'author-1',
      author_name: 'Novo Autor',
    };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      headers: { get: () => null },
      json: async () => created,
    });

    const result = await createUser({ email: 'novo@example.com', author_name: 'Novo Autor' });

    expect(result).toEqual(created);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'novo@example.com',
      author_name: 'Novo Autor',
    });
  });

  it('surfaces API validation message on 400', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => '"The Email field is not a valid e-mail address."',
    });

    await expect(createUser({ email: 'invalid', author_name: 'Test' })).rejects.toThrow(
      'The Email field is not a valid e-mail address.'
    );
  });
});
