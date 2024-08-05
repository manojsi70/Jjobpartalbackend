import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { getAdminJobs, getAllJobs, getJobById, post } from '../controlles/job.controller.js';


const router = express.Router();

router.route("/post").post(isAuthenticated, post);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjos").get(isAuthenticated, getAdminJobs)
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;