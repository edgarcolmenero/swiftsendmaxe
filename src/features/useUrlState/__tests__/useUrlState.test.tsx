import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UrlStateProvider, useUrlState } from '../context';

function TestComponent({ onReady }: { onReady: (value: string | null, set: (val: string) => void) => void }) {
  const { get, set } = useUrlState();
  onReady(get('foo'), (val) => set('foo', val));
  return null;
}

describe('useUrlState', () => {
  it('reads and writes query parameters', () => {
    window.history.replaceState(null, '', '/?foo=bar');
    let receivedValue: string | null = null;
    let setter: ((value: string) => void) | null = null;

    render(
      <UrlStateProvider>
        <TestComponent
          onReady={(value, set) => {
            receivedValue = value;
            setter = set;
          }}
        />
      </UrlStateProvider>,
    );

    expect(receivedValue).toBe('bar');
    setter?.('baz');
    expect(new URL(window.location.href).searchParams.get('foo')).toBe('baz');
  });
});
