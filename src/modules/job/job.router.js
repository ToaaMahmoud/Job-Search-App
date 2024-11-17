import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as jobController from './controller/job.js'
import { auth } from "../../middleware/authentication.js";
import {createdMulter} from '../../middleware/multer.js'
import { validation } from "../../middleware/validation.js";
import { addJob, applyToJobschema, filter, updateJob } from "./job.schema.js";

const router = Router()
router.post("/add-job", auth,validation(addJob) ,asyncHandler(jobController.addJob))
router.put("/update-job", auth,validation(updateJob), asyncHandler(jobController.updateJob))
router.delete("/delete-job", auth, asyncHandler(jobController.deleteJob))
router.get("/get-all-jobs", auth, asyncHandler(jobController.getAllJobs))
router.get("/get-jobs-company/:name", auth, asyncHandler(jobController.getAllJobsWithcompanyName))
router.get("/get-job-filter", auth,validation(filter), asyncHandler(jobController.filterJob))
router.post("/apply-job/:jobId",auth,validation(applyToJobschema), createdMulter({filePath : "Resume"}).single('userResume'),asyncHandler(jobController.applyToJob))
export default router