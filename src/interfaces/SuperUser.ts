export interface SuperUser {
  id?: string | null;
  type: "admin" | "support";
  email: string;
}
