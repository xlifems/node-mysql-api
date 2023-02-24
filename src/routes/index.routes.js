import { Router } from "express";
import { getStudent, getStudents } from "../controllers/students.controller";

const router = Router();

router.get("/students", getStudents);

export default router;
