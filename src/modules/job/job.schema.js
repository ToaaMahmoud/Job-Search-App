import Joi from "joi"
// add job
export const addJob = {
body: Joi.object({
    jobTitle: Joi.string().required().error(new Error('Job title is required')),
    jobLocation: Joi.string().required().error(new Error('Job location is required')),
    workingTime: Joi.string().required().error(new Error('Working time is required')),
    seniorityLevel: Joi.string().required().error(new Error('Seniority level is required')),
    jobDescription: Joi.string().required().error(new Error('Job description is required')),
    technicalSkills: Joi.array().items(Joi.string()).required().error(new Error('Technical skills are required')),
    softSkills: Joi.array().items(Joi.string()).required().error(new Error('Soft skills are required')),
  })
}

export const updateJob = {
    body: Joi.object({
        jobLocation: Joi.string().optional(),
        seniorityLevel: Joi.string().optional(),
        jobDescription: Joi.string().email()
          })
}

export const filter = {
    body: Joi.object({
        jobTitle: Joi.string().optional().error(new Error('Job title is required')),
        jobLocation: Joi.string().optional().error(new Error('Job location is required')),
        workingTime: Joi.string().optional().error(new Error('Working time is required')),
        seniorityLevel: Joi.string().optional().error(new Error('Seniority level is required')),
        technicalSkills: Joi.array().items(Joi.string()).required().error(new Error('Technical skills are required')),
      })
    }

    export const applyToJobschema = {
        body: Joi.object({
            userTechSkills: Joi.array().items(Joi.string()).required().error(new Error('Technical skills are required')),
            userSoftSkills: Joi.array().items(Joi.string()).required().error(new Error('Soft skills are required'))
        }),
        params: Joi.object({
            jobId: Joi.string().required()
        })
    }