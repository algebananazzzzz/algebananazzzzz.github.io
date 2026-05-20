import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedComplexity } from './useReducedComplexity';

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

describe('useReducedComplexity', () => {
  it('returns false when neither reduced-motion nor mobile-width matches', () => {
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(false);
  });

  it('returns true when reduced-motion matches', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('reduced-motion'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(true);
  });

  it('returns true when max-width 720 matches', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('max-width: 720px'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(true);
  });
});
