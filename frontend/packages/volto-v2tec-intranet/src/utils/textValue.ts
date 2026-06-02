/** Converte valores da API (string, número ou vocabulário) para texto exibível. */
export const textValue = (value: unknown): string => {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (record.title != null) {
      return String(record.title);
    }
    if (record.token != null) {
      return String(record.token);
    }
  }
  return '';
};
