import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryIndexPageJump } from './StoryIndex';

describe('StoryIndexPageJump', () => {
  it('chama onPageChange com a página digitada ao confirmar com Enter', () => {
    const onPageChange = vi.fn();
    render(<StoryIndexPageJump currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const field = screen.getByRole('textbox', { name: /ir para página/i });
    fireEvent.change(field, { target: { value: '3' } });
    fireEvent.keyDown(field, { key: 'Enter', code: 'Enter' });

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('faz clamp para totalPages quando o valor excede o intervalo', () => {
    const onPageChange = vi.fn();
    render(<StoryIndexPageJump currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const field = screen.getByRole('textbox', { name: /ir para página/i });
    fireEvent.change(field, { target: { value: '99' } });
    fireEvent.blur(field);

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('faz clamp para 1 quando o valor é menor que 1', () => {
    const onPageChange = vi.fn();
    render(<StoryIndexPageJump currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const field = screen.getByRole('textbox', { name: /ir para página/i });
    fireEvent.change(field, { target: { value: '0' } });
    fireEvent.blur(field);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('repõe o texto para a página atual quando a entrada é vazia ao sair do campo', () => {
    const onPageChange = vi.fn();
    render(<StoryIndexPageJump currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    const field = screen.getByRole('textbox', { name: /ir para página/i });
    fireEvent.change(field, { target: { value: '' } });
    fireEvent.blur(field);

    expect(onPageChange).not.toHaveBeenCalled();
    expect(field).toHaveValue('2');
  });
});
