import {Schema, model} from 'mongoose'

const companySchema = new Schema({
    companyName:{
        type: String,
        unique: true
    },
    description :{
        type: String
    },
    industry:{
        type: String
    },
    address:{
        type: String
    },
    numberOfEmployees:{
        type: Number,
        min: 11, 
        max: 20
    },
    companyEmail:{
        type: String,
        unique: true
    },
    companyHR:{
        type: Schema.ObjectId,
        ref: 'User'
    },
}, {timestamps: true})


const Company = model('Company', companySchema)

export default Company