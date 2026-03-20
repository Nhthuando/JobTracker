import express from "express";
import {createJob,deleteJob,getAllJobs,getJob,updateJob,getJobStats} from "../controllers/jobController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/stats", verifyToken, getJobStats);
router.get("/", verifyToken, getAllJobs);
router.get("/:id", verifyToken, getJob);
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

export default router;