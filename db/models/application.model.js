import {Schema, model} from 'mongoose'

const applicationSchema = new Schema({
    jobId:{
        type: Schema.ObjectId,
        ref: 'Job'
    },
    userId:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    userTechSkills:[{
        type: String,
        required: true
    }],
    userSoftSkills:[{
        type: String,
        required: true
    }],
    userResume:{
        type: String
    }
}, {timestamps: true})

const Applications = model('Applications', applicationSchema)
export default Applications