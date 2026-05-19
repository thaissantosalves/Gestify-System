export function nowBr(): string {
  return formatBrDateTime(new Date().toISOString());
}

export function formatBrDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function nextId(prefix: string, list: { id: string }[]): string {
  const nums = list
    .map((item) => parseInt(item.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(4, "0")}`;
}
