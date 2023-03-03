import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employees.controller.js";
import { verifyToken } from "../middleware/validateToken.js";

const router = Router();

router.get("/employees", verifyToken, getEmployees);

router.get("/employees/:id", getEmployee);

router.post("/employees", createEmployee);

router.patch("/employees/:id", updateEmployee);

router.delete("/employees/:id", deleteEmployee);

export default router;
