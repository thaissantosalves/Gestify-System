const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Evita `id.eq.PRD-0001` em coluna uuid (erro 22P02 no Postgres). */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}
