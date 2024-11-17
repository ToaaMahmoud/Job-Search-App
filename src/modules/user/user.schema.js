



import Joi from "joi";
import { role } from "../../types/user.role.js";
// sign up
export const signupSchema = {
    body: Joi.object({
        firstName:Joi.string().required().lowercase().trim(),
        lastName:Joi.string().required().lowercase().trim(),
        email:Joi.string().required().email(),
        password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .message('password must be 8 characters long and contain at least one lowercase letter,one uppercase letter,numbers,Special_Char'),
        role:Joi.string().valid('User','Company_HR'),
        DOB: Joi.date().required(),
        confirmPassword:Joi.string().valid(Joi.ref('password')).required(),
        mobileNumber:Joi.string().required(),
        recoveryEmail:Joi.string().email()
    })
}

// update password

export const updateSchema = {
    body: Joi.object({
        password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .message('password must be 8 characters long and contain at least one lowercase letter,one uppercase letter,numbers,Special_Char')
    })
}

// resetPassword
export const resetPassword = {
    body: Joi.object({
        email:Joi.string().required().email(),
        newPassword: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
        otp: Joi.string().required()
    })
}