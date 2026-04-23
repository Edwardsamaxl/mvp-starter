import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './client.js';

// Mock fetch for tests
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('should call fetch with correct endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const result = await api.get('/test');

      expect(fetch).toHaveBeenCalledWith('/api/v1/test', expect.objectContaining({
        credentials: 'include',
      }));
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('post', () => {
    it('should send JSON body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      const result = await api.post('/items', { name: 'test' });

      expect(fetch).toHaveBeenCalledWith('/api/v1/items', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      }));
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('error handling', () => {
    it('should throw on non-ok response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      await expect(api.get('/not-found')).rejects.toThrow('Not found');
    });
  });
});
