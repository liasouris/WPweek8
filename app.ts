import express, {Express} from "express"
import path from "path"
import morgan from "morgan"
import userRouter from "./src/routes/index"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

const App: Express = express()
const port =  3000

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb" //mongodb://localhost:27017/testdb.
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

App.use(express.json())
App.use(express.urlencoded({extended: false}))
App.use(morgan("dev"))


App.use(express.static(path.join(__dirname, "../public")))
App.use("/", userRouter) 

App.listen(port, () => {
    console.log(`Server running on port ${port}`)

})


