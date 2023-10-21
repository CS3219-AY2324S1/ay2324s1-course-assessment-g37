import { param } from "express-validator";

const usernameValidator = param("username")
  .exists({ checkFalsy: true })
  .withMessage("Username is required")
  .isString()
  .withMessage("Username should be a string");

export default usernameValidator;
