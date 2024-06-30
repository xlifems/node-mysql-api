import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  getStudentsPagination,
  updateStudent,
} from "../controllers/students.controller.js";

const router = Router();

router.get("/students", getStudents);
router.post("/students/pagination", getStudentsPagination)
router.get("/students/:id", getStudent);
router.post("/students", createStudent);
router.patch("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;
