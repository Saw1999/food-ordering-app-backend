import express from "express";
import UserController from "../controllers/UserController";
import { jwtCheck, jwtParse} from "../middleware/auth";
import { validateUserRequest } from "../middleware/validation";

const router = express.Router();

// get user
router.get("/", jwtCheck, jwtParse, UserController.getUser);

// create a user
router.post("/", jwtCheck, UserController.createUser);

// update user
router.put("/", jwtCheck, jwtParse, validateUserRequest, UserController.updateUser);

export default router;