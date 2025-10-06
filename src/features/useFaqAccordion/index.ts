import { useCallback, useMemo, useState } from 'react';
import faqJson from '@data/faq.json';
import { faqDataSchema } from '@shared/types';
import { validateJson } from '@shared/lib/validate-json';

const faqData = validateJson(faqDataSchema, faqJson, 'FAQ content');

export function useFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqData[0]?.id ?? null);
  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    if (!filter.trim()) {
      return faqData;
    }
    const term = filter.trim().toLowerCase();
    return faqData.filter((item) =>
      [item.q, item.a, ...(item.tags ?? [])].some((value) => value.toLowerCase().includes(term)),
    );
  }, [filter]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const buttons = Array.from(
        event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('button[data-faq-id]') ?? [],
      );

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight': {
          event.preventDefault();
          const next = (index + 1) % buttons.length;
          buttons[next]?.focus();
          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          event.preventDefault();
          const prev = (index - 1 + buttons.length) % buttons.length;
          buttons[prev]?.focus();
          break;
        }
        case 'Home':
          event.preventDefault();
          buttons[0]?.focus();
          break;
        case 'End':
          event.preventDefault();
          buttons[buttons.length - 1]?.focus();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          event.currentTarget.click();
          break;
        default:
          break;
      }
    },
    [],
  );

  return {
    items,
    openId,
    toggle,
    filter,
    setFilter,
    onKeyDown,
  };
}
