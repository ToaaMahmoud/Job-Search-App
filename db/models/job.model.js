import {Schema, model} from 'mongoose'
import { joblocation, seniorityLevel, workingTime } from '../../src/types/types.js'
const jobSchema = new Schema({
    jobTitle:{
        type: String
    },
    jobLocation :{
        type: String,
        enum: Object.values(joblocation)
    },
    workingTime:{
        type: String,
        enum: Object.values(workingTime)
    },
    seniorityLevel:{
        type: String,
        enum: Object.values(seniorityLevel)
    },
    jobDescription :{
        type: String
    },
    technicalSkills: [{
        type: [String],
        required: true,
      }],
    softSkills: [{
        type: String,
        required: true,
      }],
    addedBy:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    company:{
        type: Schema.ObjectId,
        ref: 'Company'
    }  
}, {timestamps: true})


const Job = model('Job', jobSchema)
export default Job

