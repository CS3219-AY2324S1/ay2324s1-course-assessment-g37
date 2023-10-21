export interface User {
  username: string;
  displayName: string;
  password: string;
  role: "basic" | "admin";
}
