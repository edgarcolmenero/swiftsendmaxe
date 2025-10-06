import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { UrlStateProvider } from '@app/providers/url-state';
import { useChatRetriever } from '..';

const wrapper = ({ children }: { children: ReactNode }) => <UrlStateProvider>{children}</UrlStateProvider>;

describe('useChatRetriever', () => {
  it('returns shortcut for pricing queries', () => {
    const { result } = renderHook(() => useChatRetriever(), { wrapper });
    const response = result.current.respond('Tell me about pricing');
    expect(response.shortcutHref).toBe('/#packs');
  });

  it('suggests items when unsure', () => {
    const { result } = renderHook(() => useChatRetriever(), { wrapper });
    const response = result.current.respond('zzzz');
    expect(response.suggestions).toBeDefined();
  });
});
