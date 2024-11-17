import { connection } from "../db/connection.js"
import dotenv from 'dotenv'
import userRouter from './modules/user/user.router.js'
import companyRouter from './modules/company/company.router.js'
import jobRouter from './modules/job/job.router.js'
import { globalErrorHandling } from "./utlis/asyncHandler.js"

const bootstrap = (app, express, cors) =>{
    process.on('uncaughtException', (err) => {
        console.log(err);
    })
    app.use(express.json())
    app.use(cors())
    dotenv.config()
    connection()
    app.use('/user', userRouter)
    app.use('/company', companyRouter)
    app.use('/job', jobRouter)
    app.use("*", (req, res) => {
            return next(new AppError("Api is not found.", 404))
          });
    process.on('unhandledRejection', (err) => {
        console.log(err);
    })
    app.use(globalErrorHandling)
}

export default bootstrap