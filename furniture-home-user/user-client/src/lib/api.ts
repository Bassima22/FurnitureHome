import type { Item, Paginated, Section } from "../types/Item";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050/api";
const normalize = (s: string) => s.toLowerCase().replace(/-/g, "");

export async function fetchItems(params: {
  room: string;
  section?: Section;
  page?: number;
  limit?: number;
}): Promise<Paginated<Item>> {
  const room = normalize(params.room);
  const section = params.section ? normalize(params.section) : undefined;

  const usp = new URLSearchParams();
  usp.set("room", room);
  if (section) usp.set("section", section);
  if (params.page) usp.set("page", String(params.page));
  if (params.limit) usp.set("limit", String(params.limit));

  const res = await fetch(`${API}/items?${usp.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json() as Promise<Paginated<Item>>;
}
