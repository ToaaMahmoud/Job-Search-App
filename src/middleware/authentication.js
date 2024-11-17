import jwt from 'jsonwebtoken'
import User from "../../db/models/user.model.js"
import { asyncHandler } from "../utlis/asyncHandler.js"

export const auth = asyncHandler(async(req, res, next) =>{
            const {token} = req.headers
        if(!token) return res.status(400)
            .json({message: "Please signin first, there is no token."})

        if(!token.startsWith("jobapp ")) 
            return res.status(400).json({message: "invaild token."})
        const originalToken = token.split(" ")[1]
        const decodedData = jwt.verify(originalToken, process.env.SECRETKEYl)
        if(!decodedData?.userId) 
            return res.status(400).json({message: "invaild token payload."})
        const user = await User.findById(decodedData.userId).select('-password')
        if(!user) 
            return res.status(404).json({message: "Please sign in again."})
         req.authUser = user
         next()
    }
)