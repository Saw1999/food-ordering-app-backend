import { Request, Response } from "express"
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

//get my restaurant 
const getMyRestaurant = async(req: Request, res: Response) => {
    try{
        const restaurant = await Restaurant.findOne({user: req.userId});

        if(!restaurant){
            return res.status(404).json({message: "Restaurant not found!"});
        }

        res.json(restaurant);
    }
    catch(err){
        console.log("error: ", err);
        res.status(500).json({message: "Some went wrrong while fetching restaurant data!"});
    }
};

//create restaurant
const createRestaurant = async(req: Request, res: Response) => {
    try{
        const existingRestaurant = await Restaurant.findOne({user: req.userId });

        //checking if the user already has a restaurant created
        if (existingRestaurant){
            return res.status(409).json({message: "A restaurant already exists in this user account!"});
        }

        //uploading image using cloudinary
        const imageUrl = await uploadImage(req.file as Express.Multer.File);

        // create a new restaurant in database
        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = imageUrl;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();

        await restaurant.save();

        res.status(201).send(restaurant);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "An error is found while creating a restaurant!"})
    }
};

//update restaurant
const updateRestaurant = async(req: Request, res: Response) => {
    try{
        const restaurant = await Restaurant.findOne({user: req.userId });

        //checking if the user has a restaurant
        if (!restaurant){
            return res.status(404).json({message: "Restaurant not found!"});
        }

        restaurant.restaurantName = req.body.restaurantName;
        restaurant.suburb = req.body.suburb;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliFee = req.body.deliFee;
        restaurant.estiDeliTime = req.body.estiDeliTime;
        restaurant.dishes = req.body.dishes;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();

        if(req.file){
            //uploading image using cloudinary
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }

        await restaurant.save();

        res.status(200).send(restaurant);
    }
    catch (err) {
        console.log("error: ", err);
        res.status(500).json({message: "An error is found while updating the restaurant!"})
    }
};

const uploadImage = async(file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64"); //converting image file to base 64 string
    const dataUri = `data:${image.mimetype};base64,${base64Image}`;

    const uploadRes = await cloudinary.v2.uploader.upload(dataUri); //uploading image URI to cloudinary
    return uploadRes.url;
};

export default {getMyRestaurant, createRestaurant, updateRestaurant};