import { Router } from "express";
import { addPage, getCertificate, getCertificatePdf, getPageById, getPages, updatePage } from "../controllers/certificates.controller.js";


const router = Router()

router.get("/certificate", getPages);
router.get("/certificate/:id", getPageById);
router.get("/certificate/student/:id", getCertificate);
router.post("/certificate/student/pdf", getCertificatePdf);
router.post("/certificate", addPage);
router.put("/certificate/:id", updatePage);


export default router;