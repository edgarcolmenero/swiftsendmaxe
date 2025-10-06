import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { UrlStateProvider } from '@app/providers/url-state';
import { useContactEstimator } from '..';

const wrapper = ({ children }: { children: ReactNode }) => <UrlStateProvider>{children}</UrlStateProvider>;

describe('useContactEstimator', () => {
  it('returns savings for selected pack', () => {
    const { result } = renderHook(() => useContactEstimator(), { wrapper });
    act(() => {
      result.current.selectPack('Builder');
    });
    expect(result.current.resultText?.pill).toBe('Builder Pack');
    expect(result.current.resultText?.amount).toBe('$5,200');
  });
});
