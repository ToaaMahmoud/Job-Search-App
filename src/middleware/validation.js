import { AppError } from "../utlis/appError.js"


const requestKey = ["body", "params", "headers", "query"]

export const validation = (schema) =>{
    return(req, res, next) =>{
        let validationError = []
        for(const key in requestKey) {
            const validateResult = schema[key]?.validate(req[key], {abortEarly: false})
            if(validateResult?.error) validationError.push(validateResult.error.details)
        }
    if(validationError.length) next(new AppError("Vaildation error.", 400 ))
    next()    
    }
}