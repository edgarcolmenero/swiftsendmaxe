import { useEffect, useMemo, useState } from 'react';
import { useUrlState } from '@app/providers/url-state';

const PACK_SAVINGS: Record<string, number> = {
  starter: 1200,
  builder: 5200,
  engine: 8200,
  growth: 6400,
};

const NORMALIZE: Record<string, string> = {
  Starter: 'starter',
  Builder: 'builder',
  Engine: 'engine',
  Growth: 'growth',
};

const TITLE_CASE: Record<string, string> = {
  starter: 'Starter',
  builder: 'Builder',
  engine: 'Engine',
  growth: 'Growth',
};

export function useContactEstimator() {
  const { get, set } = useUrlState();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const queryValue = get('ptype');
    if (queryValue) {
      const normalized = queryValue.toLowerCase();
      if (normalized in PACK_SAVINGS) {
        setSelected(normalized);
      }
    }
  }, [get]);

  const selectPack = (packName: string | null) => {
    if (!packName) {
      setSelected(null);
      set('ptype', null);
      return;
    }

    const normalized = NORMALIZE[packName] ?? packName.toLowerCase();
    setSelected(normalized);
    set('ptype', normalized, { replace: true });
  };

  const savings = selected ? PACK_SAVINGS[selected] ?? null : null;
  const label = selected ? TITLE_CASE[selected] ?? selected : null;

  const resultText = useMemo(() => {
    if (!savings || !label) {
      return null;
    }
    return {
      pill: `${label} Pack`,
      amount: `$${savings.toLocaleString()}`,
    };
  }, [label, savings]);

  return {
    selectedPack: selected,
    savings,
    resultText,
    selectPack,
  };
}
