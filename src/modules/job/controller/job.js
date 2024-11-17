import Applications from "../../../../db/models/application.model.js"
import Company from "../../../../db/models/company.model.js"
import Job from "../../../../db/models/job.model.js"
import { AppError } from "../../../utlis/appError.js"

export const addJob = async(req, res, next) =>{
    if(req.authUser.role != "Company_HR" || req.authUser.status != "online") return next(new AppError("You don't have the permision to add the company.", 401))
    const companyExist = await Company.findOne({companyHR: req.authUser._id})
    if(!companyExist) return next(new AppError("Company with this HR not found.", 404))
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills} = req.body
    const addedBy = req.authUser._id
    const company = companyExist._id
    const job = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        company
    })   
    await job.save()
    return res.status(200).json({message: "Job added successfully."})
}

export const updateJob = async(req, res, next) =>{
    if(req.authUser.role != "Company_HR" || req.authUser.status != "online") return next(new AppError("You don't have the permision to update the company.", 401))
    const job = await Job.findOne({addedBy: req.authUser._id})
    if(!job) return next(new AppError("This HR doesn't have the permision to update this job.", 401)) 
    const {...updatedData} = req.body 
    job.set({ ...updatedData })
    await job.save()
    return res.status(200).json({message: "Job updated successfully."})
}
export const deleteJob = async(req, res, next) =>{
    if(req.authUser.role != "Company_HR" || req.authUser.status != "online") return next(new AppError("You don't have the permision to delete the company.", 401))
    const job = await Job.findOne({addedBy: req.authUser._id})
    if(!job) return next(new AppError("This HR doesn't have the permision to delete this job.", 401)) 
    await job.deleteOne() 
    return res.status(200).json({message: "Job deleted successfully."})
}

export const getAllJobs = async(req, res, next)=>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 401))
    const all = await Job.find().populate('company')
    return res.status(200).json({"All jobs are, " : all})
}

export const getAllJobsWithcompanyName = async(req, res, next) =>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 401))
    const {name} = req.params
    const company = await Company.findOne({companyName: name})
    if(!company) return next(new AppError("This company is not exist.", 404))
    const HR = company.companyHR 
    const allJobs = await Job.find({addedBy: HR})
    return res.status(200).json({"All jobs realated to this company is": allJobs})    
}

export const filterJob = async(req, res, next) =>{
    if(req.authUser.status != "online") return next(new AppError("Login first.", 401))
    const {workingTime, jobLocation, seniorityLevel, jobTitle,technicalSkills } = req.body
    const query = {}
    if(workingTime) query.workingTime = workingTime
    if(jobLocation) query.jobLocation = jobLocation
    if(seniorityLevel) query.seniorityLevel = seniorityLevel 
    // enable searching for job in case-insensitive.
    if(jobTitle) query.jobTitle = { $regex: new RegExp(jobTitle, 'i') }
    // return all jobs that contain any one of the enterd skills. 
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills };
    const matchedJobs = await Job.find(query)
    if(matchedJobs.length < 1) return next(new AppError("There is no job matches.", 404))
    return res.status(200).json({"The matched jobs are ": matchedJobs})
}

export const applyToJob = async(req, res, next) =>{
    console.log(req.file);
    // check if user online or not.
    if(req.authUser.status != "online") return next(new AppError("Login first.", 401))
    // check if user is User not HR.
    if(req.authUser.role != "User") return next(new AppError("You don't have the permision to apply for this job.", 401))
    const {userTechSkills, userSoftSkills} = req.body
    const{jobId} = req.params
    const jobExist = await Job.findById(jobId)
    if(!jobExist) return next(new AppError("Job is no longer exist.", 404))
    const userId = req.authUser._id
    const applied = await Applications.findOne({userId, jobId})
    if(applied) return next(new AppError("You already applied for this job.", 400))
    const userResume = req.file.path  
    const applicant = new Applications({
        jobId,
        userSoftSkills,
        userTechSkills,
        userId,
        userResume
    })
    await applicant.save()
    return res.status(201).json({message:"Applied successfully."})
}