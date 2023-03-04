import { Router } from "express";
import {  
  createUser,
  getUser,
  login,
} from "../controllers/users.controller.js";


const router = Router();

router.get("/users", getUser);
router.post("/users", createUser);
router.post("/users/login", login);

export default router;
