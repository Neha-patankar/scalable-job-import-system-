import express from "express";
import { getImportHistory } from "../controllers/importController.js";

const router = express.Router();
router.get("/history", getImportHistory);

export default router;
