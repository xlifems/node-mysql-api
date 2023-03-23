import { Router } from "express";
import {
  createSchool,
  deleteSchool,
  getSchool,
  getSchools,
  updateSchool,
} from "../controllers/school.controller.js";

const router = Router();

router.get("/schools", getSchools);
router.get("/schools/:id", getSchool);
router.post("/schools", createSchool);
router.patch("/schools/:id", updateSchool);
router.delete("/schools/:id", deleteSchool);

export default router;
