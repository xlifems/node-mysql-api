import { Router } from "express";
import { getCertificate } from "../controllers/certificates.controller.js";


const router = Router()

router.get("/certificate/:id", getCertificate)

export default router;