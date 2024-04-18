import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import { v2 as cloudinary } from "cloudinary";



const app = express();

// connecting to database
mongoose.connect(process.env.MONGODB_CONNECTION as string)
.then(
    () => console.log("Successfully connected to MongoDB!")
)


//connecting to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// middleware
// app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.get("/health", async(req: Request, res: Response) => {
    res.send({meassge: "health ok!"})
});

app.use("/api/my/user", userRoute);
app.use("/api/my/restaurant", myRestaurantRoute);

app.listen(8888, () => {
    console.log("Server is running on localhost:8888!")
})