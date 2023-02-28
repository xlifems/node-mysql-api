import { Router } from "express";
import { createUser, getUser } from "../controllers/users.controller.js";

const router = Router()

router.get("/users", getUser)
router.post("/users", createUser)

export default router;