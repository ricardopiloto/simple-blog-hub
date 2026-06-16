import { describe, it, expect } from 'vitest';
import { parseBffErrorMessage } from './client';

describe('parseBffErrorMessage', () => {
  it('returns quoted JSON string from ASP.NET BadRequest(string)', () => {
    const body = '"The Email field is not a valid e-mail address."';
    expect(parseBffErrorMessage(400, body)).toBe('The Email field is not a valid e-mail address.');
  });

  it('returns first validation error from errors object', () => {
    const body = JSON.stringify({
      title: 'Bad Request',
      errors: { Email: ['O campo Email é obrigatório.'] },
    });
    expect(parseBffErrorMessage(400, body)).toBe('O campo Email é obrigatório.');
  });

  it('returns generic message when body is empty', () => {
    expect(parseBffErrorMessage(400, '')).toBe('Erro do servidor (400)');
  });
});
