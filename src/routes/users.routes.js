import { Router } from "express";
import {  
  createUser,
  getUser,
  getUsers,
  login,
} from "../controllers/users.controller.js";


const router = Router();

// get all users
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);
router.post("/users/login", login);

export default router;
