import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validateJson } from '../validate-json';

describe('validateJson', () => {
  it('returns parsed data when valid', () => {
    const schema = z.object({ name: z.string() });
    const result = validateJson(schema, { name: 'SwiftSend' }, 'test');
    expect(result.name).toBe('SwiftSend');
  });

  it('throws when invalid', () => {
    const schema = z.object({ ok: z.string() });
    expect(() => validateJson(schema, { ok: 123 }, 'broken')).toThrow();
  });
});
