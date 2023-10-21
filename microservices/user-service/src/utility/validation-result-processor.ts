import { Request } from "express";
import { validationResult } from "express-validator";

const isRequestValid = (req: Request) => {
  const errors = validationResult(req);

  return errors.isEmpty();
};

export default isRequestValid;
