import { Router } from "express";
import * as companyController from './controller/company.js'
import { asyncHandler } from "../../utlis/asyncHandler.js";
import { auth } from "../../middleware/authentication.js";
const router = Router()
router.post("/add-company", auth, asyncHandler(companyController.addCompany))
router.put("/update-data", auth, asyncHandler(companyController.updateData))
router.delete("/delete-company", auth, asyncHandler(companyController.deleteCompany))
router.get("/get-company-data/:id", auth, asyncHandler(companyController.getCompanyData))
router.get("/get-company-with-name/:name", auth, asyncHandler(companyController.getCompanyName))
router.get("/get-all-applications/:jobId", auth, asyncHandler(companyController.getAllApplication))
export default router