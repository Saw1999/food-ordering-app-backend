import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute";
import { send } from "process";


const app = express();

// connecting to database
mongoose.connect(process.env.MONGODB_CONNECTION as string)
.then(
    () => console.log("Successfully connected to MongoDB!")
)

// middleware
// app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.get("/health", async(req: Request, res: Response) => {
    res.send({meassge: "health ok!"})
});

app.use("/api/my/user", userRoute)

app.listen(8888, () => {
    console.log("Server is running on localhost:8888!")
})