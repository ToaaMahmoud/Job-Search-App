import multer from "multer";
import fs from "fs"
import path from "path";
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { AppError } from "../utlis/appError.js";


export const createdMulter = ({filePath  = "general"} = {}) => {
  const destinationPath = path.resolve(`src/uploads/${filePath}`)
  if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath, {recursive: true})
  const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, destinationPath)
    },
    filename:(req, file, cb)=>{
      const uniquFileName = DateTime.now().toFormat('yyyy-mm-dd')+ "__" + nanoid(2) + "__"+ file.originalname
      cb(null, uniquFileName)
    } 
  })
  const fileFilter = (req, file, cb) =>{
    if(file.mimetype == "application/pdf") return cb(null, true)
     cb(new AppError("Invaild file type, only .pdf is allowed.", 400), false)  
  } 
   const uploadFile = multer({fileFilter, storage})
   return uploadFile
};