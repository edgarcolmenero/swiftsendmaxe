import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface UrlStateOptions {
  replace?: boolean;
}

export interface UrlStateValue {
  get: (key: string) => string | null;
  getAll: () => URLSearchParams;
  hash: string;
  set: (key: string, value: string | null, options?: UrlStateOptions) => void;
  setHash: (hash: string | null, options?: UrlStateOptions) => void;
}

const UrlStateContext = createContext<UrlStateValue | undefined>(undefined);

const getInitialState = () => ({
  search: new URLSearchParams(window.location.search),
  hash: window.location.hash.replace(/^#/, ''),
});

export function UrlStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => getInitialState());

  useEffect(() => {
    const handle = () => {
      setState(getInitialState());
    };

    window.addEventListener('popstate', handle);
    window.addEventListener('hashchange', handle);
    return () => {
      window.removeEventListener('popstate', handle);
      window.removeEventListener('hashchange', handle);
    };
  }, []);

  const contextValue = useMemo<UrlStateValue>(() => {
    const buildUrl = (search: URLSearchParams, hash: string, replace?: boolean) => {
      const url = `${window.location.pathname}${search.toString() ? `?${search.toString()}` : ''}${hash ? `#${hash}` : ''}`;
      if (replace) {
        window.history.replaceState(null, '', url);
      } else {
        window.history.pushState(null, '', url);
      }
      setState({ search: new URLSearchParams(search), hash });
    };

    return {
      get: (key: string) => state.search.get(key),
      getAll: () => new URLSearchParams(state.search),
      hash: state.hash,
      set: (key, value, options) => {
        const next = new URLSearchParams(state.search);
        if (value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        buildUrl(next, state.hash, options?.replace);
      },
      setHash: (hash, options) => {
        const nextHash = hash ? hash.replace(/^#/, '') : '';
        buildUrl(state.search, nextHash, options?.replace);
      },
    };
  }, [state.hash, state.search]);

  return <UrlStateContext.Provider value={contextValue}>{children}</UrlStateContext.Provider>;
}

export function useUrlState() {
  const ctx = useContext(UrlStateContext);
  if (!ctx) {
    throw new Error('useUrlState must be used within UrlStateProvider');
  }
  return ctx;
}
