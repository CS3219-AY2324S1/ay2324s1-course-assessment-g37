import { User } from "../models/user";

interface DbUser {
  username: string;
  display_name: string;
  password: string;
  role: "basic" | "admin";
}

const convertUserFields = (dbUser: DbUser): User => {
  const user: User = {
    username: dbUser.username,
    displayName: dbUser.display_name,
    password: dbUser.password,
    role: dbUser.role,
  };

  return user;
};

export default convertUserFields;
