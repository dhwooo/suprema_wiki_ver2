export type TocItem = {
  id: string;
  label: string;
  children?: TocItem[];
};

export function tocId(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
