export type UrlStateSnapshot = { search: URLSearchParams; hash: string };
type Listener = (s: UrlStateSnapshot) => void;
type SetOptions = { replace?: boolean };

const listeners = new Set<Listener>();
const snap = (): UrlStateSnapshot => ({ search: new URLSearchParams(location.search), hash: location.hash });
const notify = () => {
  const s = snap();
  listeners.forEach((l) => l(s));
};

export const urlState = {
  subscribe(l: Listener) {
    listeners.add(l);
    l(snap());
    return () => listeners.delete(l);
  },
  setHash(hash: string, o: SetOptions = {}) {
    const h = hash.startsWith('#') ? hash : `#${hash}`;
    const url = `${location.pathname}${location.search}${h}`;
    (o.replace ? history.replaceState : history.pushState).call(history, {}, '', url);
    notify();
  }
};
export const initUrlState = () => {
  addEventListener('popstate', notify);
  addEventListener('hashchange', notify);
};
