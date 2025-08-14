export type Section = "item" | "gallery";

export interface Item {
  _id: string;
  title: string;
  price: number;
  imgURL: string;
  room: "kitchen" | "livingroom" | "bedroom";
  section: Section;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
