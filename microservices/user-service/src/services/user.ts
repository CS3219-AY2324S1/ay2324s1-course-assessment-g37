import * as db from "../db";
import { User } from "../models/user";

export const getUser = async (username: string) => {
  const text = "SELECT * FROM users WHERE username = $1";
  const values = [username];

  const result = await db.query(text, values);
  return result.rows[0];
};

export const createUser = async (user: User) => {
  const text = "INSERT INTO users VALUES($1, $2, $3, $4)";
  const values = [user.username, user.displayName, user.password, user.role];

  const result = await db.query(text, values);
  return result;
};

export const updateUser = async (user: User) => {
  // Role will never be updated through an api call
  const text =
    "UPDATE users SET display_name = $1, password = $2 WHERE username = $3";
  const values = [user.displayName, user.password, user.username];

  const result = await db.query(text, values);
  return result;
};

export const deleteUser = async (username: string) => {
  const text = "DELETE FROM users WHERE username = $1";
  const values = [username];

  const result = await db.query(text, values);
  return result.rowCount === 1;
};
