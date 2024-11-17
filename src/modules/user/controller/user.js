import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../../../../db/models/user.model.js"
import { AppError } from "../../../utlis/appError.js"
import { sendMail } from '../../../utlis/send.mail.js'
import { generateOTP } from '../../../utlis/otp.generator.js'
import Company from '../../../../db/models/company.model.js'
import Job from '../../../../db/models/job.model.js'

export const signUp =  async(req, res, next) =>{
    const {firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role} = req.body
    // Add User Full Name to req.
    req.body.userName = req.body.firstName + ' ' + req.body.lastName
    const {userName} = req.body
    // Check email.
    const userExist = await User.findOne({email})
    if(userExist) return next(new AppError("This email is already used.", 409))
    // Hash password.    
    const hashPassword = bcrypt.hashSync(password, 8) 
    // Create user.
    const user = new User({
        firstName,
        lastName,
        userName,
        email,
        password : hashPassword,
        recoveryEmail,
        DOB,
        mobileNumber,
        role
    })
    // Create token to verify email.
    const token = jwt.sign({userId: user._id}, process.env.SECRETKEYE, {expiresIn: "3d"})
    const confirmLink = `${req.protocol}://${req.headers.host}/user/verify-email/${token}`

    const verify = sendMail({
        to: email,
        subject: "Welcome to Job Search App.",
        html: `<a href=${confirmLink}>Please click to verify your email.</a>`
    })
    const createdUser = await user.save()
    createdUser.password = "*****"
    return res.status(201).json({message: "Signed Up successfully.", data: createdUser})
}

// Related to confirm link sent to user.
export const verifyEmail = async(req, res, next) =>{
    const{token} = req.params
    const decoded = jwt.verify(token, process.env.SECRETKEYE)
    const userExist = await User.findByIdAndUpdate(decoded.userId, {isConfirmed: true}, {new: true})
    if(!userExist) {return next(new AppError("User is not exist.", 404))}
    return res.status(200).json({message:"Email Confirmed successfully."})
}

export const signIn = async(req, res, next) =>{
    const {password, loginMethod, loginMethodData} = req.body
    const query = { [loginMethod]: loginMethodData };
    const user = await User.findOne(query);
    if(!user) return next(new AppError("Invalid Credentials", 401))
    const match = bcrypt.compareSync(password, user.password)
    if(!match) return next(new AppError("Invalid Credentials", 401))  
    if(user.isConfirmed != true) return next(new AppError("Please, verify your email first.", 400))
    await user.updateOne({status: "online"})
    await user.save()
    const token = jwt.sign({userId: user._id, userName: user.userName}, process.env.SECRETKEYl)
    return res.status(200).json({message:"Loged in successfully.", "Token of this user: ": token})    
}

export const updateProfile = async (req, res, next) => {
  if (req.authUser.status != "online")
    return next(new AppError("Please, log in first.", 400));
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  const updatedObj = {};
  if (DOB) updatedObj.DOB = DOB;
  if (lastName) {
    updatedObj.lastName = lastName;
    updatedObj.userName = req.authUser.firstName + " " + lastName;
  }
  if (firstName) {
    updatedObj.firstName = firstName;
    updatedObj.userName = firstName + " " + req.authUser.lastName;
  }
  if(firstName && lastName )updatedObj.userName = firstName + ' ' + lastName
  if (recoveryEmail) updatedObj.recoveryEmail = recoveryEmail;
  if (email) {
    const emailExist = await User.findOne({ email });
    if (!emailExist) updatedObj.email = email;
    return next(new AppError("This email is already exist.", 409));
  }
  if (mobileNumber) {
    const mobileExist = await User.findOne({ mobileNumber });
    if (!mobileExist) updatedObj.mobileNumber = mobileNumber;
    return next(new AppError("This mobile number is already used.", 409));
  }
  const newData = await User.findByIdAndUpdate(req.authUser._id, updatedObj, {
    new: true,
  });
  return res
    .status(200)
    .json({ message: "Updated successfully.", data: newData });
};

export const deleteAccount = async(req, res, next) =>{
    if (req.authUser.status != "online")return next(new AppError("Please, log in first.", 400));
    if(req.authUser.role == "Company_HR"){
      // delete the company in which HR is working
        const company=await Company.findOneAndDelete({companyHR:req.authUser._id})
        // delete all jobs added by that HR.
        const job=await Job.findOneAndDelete({addedBy:req.authUser._id})
        // delete any applications related to this jobs.
        const app=await Application.findOneAndDelete({jobId:job._id}) 
    }else{
      await User.findByIdAndDelete(req.authUser._id)
    }
    return res.status(200).json("Account deleted successfully.")   
}

export const allUserData = async(req, res, next) =>{
    if (req.authUser.status != "online")
        return next(new AppError("Please, log in first.", 400));
    const user = await User.findById(req.authUser._id)
    return res.status(200).json({"All data are ": user})
}

export const anotherUserData = async(req, res, next) =>{
    const {id} = req.params
    const user = await User.findById(id).select('-password -isConfirmed -__v -recoveryEmail -createdAt -updatedAt')
    if(!user) return next(new AppError("User is not exist", 404))   
    return res.status(200).json({"User data is ": user})    
}

export const updatePassword = async(req, res, next) =>{
    if (req.authUser.status != "online") return next(new AppError("Please, log in first.", 400));
    const {password} = req.body
    const hashPassword = bcrypt.hashSync(password, 8)
    const user = await User.findByIdAndUpdate(req.authUser._id, {password: hashPassword})
    return res.status(201).json({message:"Password Updated successfully."})
}

export const forgetPassword = async(req, res, next) =>{
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Email is not exist.", 404));
  const otp = generateOTP()
  const verifyOtp = sendMail({
    to: email,
    subject: `OTP for your password.`,
    text: `Your otp is ${otp}`,
  });
  const hashOtp = bcrypt.hashSync(otp, 8)
  await user.updateOne({otp: hashOtp})
  await user.save()
  return res.status(200).json("Please, reset your password and enter the received otp.")
}

export const resetPassword = async(req, res, next) =>{
    const {email, otp, newPassword} = req.body
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Email is not exist.", 404));
    const matchOtp = bcrypt.compareSync(otp, user.otp)
    if(!matchOtp) return next(new AppError("Invaild otp code.", 401))
    const hashPassword = bcrypt.hashSync(newPassword, 8)
    await user.updateOne({password: hashPassword})
    await user.save()
    return res.status(200).json({message:"Password updated successfully."})
}
export const gellAllWithRecoveryEmail = async(req, res, next) =>{
    const {recoveryEmail} = req.body
    const all = await User.find({recoveryEmail}).select('-password -__v  -updatedAt -createdAt -isConfirmed')
    if(all.length < 1) return next(new AppError("This email is not exist.", 404))
    return res.status(200).json({"All users are, " : all})    
}