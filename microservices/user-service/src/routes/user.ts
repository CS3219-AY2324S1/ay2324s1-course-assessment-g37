import { Router } from "express";
import * as userController from "../controllers/user";
import userValidator from "../validators/user-validator";
import usernameValidator from "../validators/username-validator";

const router = Router();

router.post("/", userValidator, userController.createUser);
router.get("/:username", usernameValidator, userController.getUser);
router.put("/:username", userValidator, userController.updateUser);
router.delete("/:username", usernameValidator, userController.deleteUser);

export default router;
