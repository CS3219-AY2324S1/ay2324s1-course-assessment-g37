import { Request, Response, RequestHandler, NextFunction } from "express";
import * as userService from "../services/user";
import { User } from "../models/user";
import isRequestValid from "../utility/validation-result-processor";
import convertUserFields from "../utility/db-result-processor";

export const getUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isRequestValid(req)) {
    return res.sendStatus(400);
  }

  const username: string = req.params.username;
  let result;

  try {
    result = await userService.getUser(username);
  } catch (error) {
    next(error);
  }

  if (!result) {
    return res.sendStatus(204);
  }

  const user = convertUserFields(result);
  res.status(200).json(user);
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isRequestValid(req)) {
    return res.sendStatus(400);
  }

  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: "basic", // Admin role have to be done manually
  };

  try {
    await userService.createUser(user);
  } catch (error: any) {
    if (error.code == "23505") {
      res.sendStatus(422);
      return;
    }

    next(error);
  }

  res.sendStatus(200);
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isRequestValid(req)) {
    return res.sendStatus(400);
  }

  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: req.body.role,
  };

  try {
    await userService.updateUser(user);
  } catch (error) {
    next(error);
  }

  res.sendStatus(200);
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isRequestValid(req)) {
    return res.sendStatus(400);
  }

  const username = req.params.username;
  let usernameExists;

  try {
    usernameExists = await userService.deleteUser(username);
  } catch (error) {
    next(error);
  }

  if (!usernameExists) {
    return res.sendStatus(404);
  }
  res.sendStatus(200);
};
