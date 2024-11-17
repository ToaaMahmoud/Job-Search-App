import { Router } from "express";
import * as userController from './controller/user.js'
import { asyncHandler } from "../../utlis/asyncHandler.js";
import { auth } from "../../middleware/authentication.js";
import { signupSchema, updateSchema,forgetPasswordSchema, resetPassword } from "./user.schema.js";
import { validation } from "../../middleware/validation.js";
const router = Router()
router.post("/sign-up", validation(signupSchema),asyncHandler(userController.signUp))
router.get("/verify-email/:token", asyncHandler(userController.verifyEmail))
router.get("/sign-in", asyncHandler(userController.signIn))
router.put("/update-account", auth,validation(signupSchema), asyncHandler(userController.updateProfile))
router.delete("/delete-account", auth, asyncHandler(userController.deleteAccount))
router.get("/all-data", auth, asyncHandler(userController.allUserData))
router.get("/another-user-data/:id", asyncHandler(userController.anotherUserData))
router.put("/update-password",validation(updateSchema), auth, asyncHandler(userController.updatePassword))
router.get("/forget-password", validation(forgetPasswordSchema), asyncHandler(userController.forgetPassword))
router.post("/reset-password",validation(resetPassword), asyncHandler(userController.resetPassword))
router.get("/get-all-recovery-email", asyncHandler(userController.gellAllWithRecoveryEmail))

export default router