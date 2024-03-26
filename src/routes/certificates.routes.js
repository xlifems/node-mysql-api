import { Router } from "express";
import { addPage, getPageById, updatePage } from "../controllers/certificates.controller.js";


const router = Router()

router.get("/certificate/:id", getPageById);
router.post("/certificate", addPage);
router.put("/certificate/:id", updatePage);

export default router;