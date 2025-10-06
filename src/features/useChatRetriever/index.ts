import { useEffect, useMemo, useState } from 'react';
import chatJson from '@data/chat-qa.json';
import { chatDataSchema } from '@shared/types';
import { validateJson } from '@shared/lib/validate-json';
import { useUrlState } from '@app/providers/url-state';

const chatData = validateJson(chatDataSchema, chatJson, 'chat knowledge base');

const SHORTCUTS: { pattern: RegExp; href: string }[] = [
  { pattern: /pricing|packs?/i, href: '/#packs' },
  { pattern: /book( a)? meeting|schedule|calendar/i, href: '/calendar' },
  { pattern: /contact|reach|talk/i, href: '/#contact' },
];

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const similarity = (a: string[], b: string[]) => {
  const setA = new Set(a);
  const setB = new Set(b);
  if (!setA.size || !setB.size) return 0;
  let overlap = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      overlap += 1;
    }
  }
  return overlap / Math.min(setA.size, setB.size);
};

export interface ChatResponse {
  answer: string;
  match?: string;
  confidence: number;
  suggestions?: string[];
  shortcutHref?: string;
}

export function useChatRetriever() {
  const { get, set } = useUrlState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const shouldOpen = get('chat');
    if (shouldOpen === 'open') {
      setIsOpen(true);
    }
  }, [get]);

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      set('chat', next ? 'open' : null, { replace: true });
      return next;
    });
  };

  const respond = useMemo(() => {
    return (question: string): ChatResponse => {
      const text = question.trim();
      if (!text) {
        return {
          answer: 'Ask me anything about SwiftSend services, packs, labs, or timelines.',
          confidence: 0,
        };
      }

      for (const shortcut of SHORTCUTS) {
        if (shortcut.pattern.test(text)) {
          return {
            answer: 'Opening the requested section for you.',
            confidence: 1,
            shortcutHref: shortcut.href,
          };
        }
      }

      const queryTokens = tokenize(text);
      let bestScore = 0;
      let best = chatData[0];

      for (const item of chatData) {
        const corpus = [item.question, ...(item.synonyms ?? []), ...(item.tags ?? []), ...(item.intents ?? [])].join(' ');
        const tokens = tokenize(corpus);
        const score = similarity(queryTokens, tokens);
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }

      if (bestScore < 0.35) {
        const suggestions = chatData.slice(0, 3).map((item) => item.question);
        return {
          answer: "I'm not fully sure, but here are a few things you can try:",
          confidence: bestScore,
          suggestions,
        };
      }

      return {
        answer: best.answer,
        confidence: bestScore,
        match: best.question,
      };
    };
  }, []);

  return {
    isOpen,
    toggle,
    respond,
  };
}
