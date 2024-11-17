import Applications from "../../../../db/models/application.model.js"
import Company from "../../../../db/models/company.model.js"
import Job from "../../../../db/models/job.model.js"
import { AppError } from "../../../utlis/appError.js"

export const addCompany = async(req, res, next) =>{
    // Check if company is added by HR not user and make sure he is online.
    if(req.authUser.role != "Company_HR" || req.authUser.status != "online") return next(new AppError("You don't have the permision to add the company.", 401))
    const {companyName, description, industry, address, numberOfEmployees, companyEmail} = req.body
     // Check if there exist another company with the same name.
    const companyExist  = await Company.findOne({companyName})
    if(companyExist) return next(new AppError("This company is already exist.", 409))
    // Check if there exist another company with the same email.
    const emailExist = await Company.findOne({companyEmail})
    if(emailExist) return next(new AppError("This email is already used.", 409))  
    const companyHR =  req.authUser._id  
     // Create company.   
    const company = new Company({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR
    })
    await company.save()
    return res.status(201).json({message:"Company added sucessfully."})
}

export const updateData = async(req, res, next) =>{
    //Check if user is online or not.
    if(req.authUser.status != "online") return next(new AppError("Login first.", 400))
    // Check if company is updated by HR  or user.
    if(req.authUser.role != "Company_HR") return next(new AppError("You don't have the permision to update data.", 401))
    const {...updatedData} = req.body    
    const company = await Company.findOne({companyHR: req.authUser._id})
    company.set({ ...updatedData })
    await company.save()
    return res.status(201).json({message:"Updated successfully."})
    }

export const deleteCompany = async(req, res, next)  =>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 400))
    if(req.authUser.role != "Company_HR") return next(new AppError("You don't have the permision to delete company.", 401))
    const company = await Company.findOne({companyHR: req.authUser._id})
    if(!company) return next(new AppError("This HR does't have the permision to delete company.", 401))
    await company.deleteOne()  
    return res.status(200).json({message:"Company deleted successfully."})         
}  

// Based on => each company has one HR and each HR can add many jobs.
export const getCompanyData = async(req, res, next) =>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 400))
    if(req.authUser.role != "Company_HR") return next(new AppError("You don't have the permision to get company data.", 401))
    const HR_id = req.authUser._id
    const {id} = req.params
    const company = await Company.findOne({_id: id, companyHR: HR_id})
    if(!company) return next(new AppError("There is no company match id and HR.", 404))
    const jobs = await Job.find({addedBy: req.authUser._id})    
    return res.status(200).json({"All data related to this company is ": company, "All jobs are ": jobs })   
}

export const getCompanyName = async(req, res, next) =>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 400))
    const {name} = req.params
    const companyExist = await Company.findOne({companyName: name})
    if(!companyExist) return next(new AppError("There is no company with that name.", 404))
    return res.status(200).json({"Company is " : companyExist})    
}

export const getAllApplication = async(req, res, next)=>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 400))
    if(req.authUser.role != "Company_HR") return next(new AppError("You don't have the permision to get all application of this job.", 401))
    // search if there exist a company with that HR.    
    const company = await Company.findOne({companyHR: req.authUser._id})  
    if(!company) return next(new AppError("There is no company matches with this HR.", 404))
    const {jobId} = req.params
    // get all applications of this job and user data.
    const all = await Applications.find({jobId}).select('-__v -createdAt -updatedAt').populate('userId')
    if(all.length < 1) return next(new AppError("There is no applications for this job.", 404))
    return res.status(200).json({"All applications are ": all})
}