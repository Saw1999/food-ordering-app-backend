import {Request, Response} from "express";
import User from "../models/user";

// get user
const getUser = async(req: Request, res: Response) => {
    try{
        const currentUser = await User.findOne({_id: req.userId});
        
        if(!currentUser) {
            return res.status(404).json({message: "User not found!"});
        }

        res.json(currentUser);
    }
    catch (err) {
        console.log(err);
    }
};

// create user
const createUser = async(req: Request, res: Response) => {
    
    try {
        const {auth0Id} = req.body;
        const isExisting = await User.findOne({auth0Id});

        //check if the user exists
        if (isExisting) {
            return res.status(200).send();
        }

        //create a user if it doesn't exist
        const newUser = new User(req.body);
        await newUser.save();

        //return the user object to the calling client
        res.status(201).json(newUser.toObject()) // coverting json to object
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message:"There is an error while creating user!"})
    }
  
};

//update user
const updateUser = async(req: Request, res: Response) => {
    try{
        const {name, addressLine1, addressLine2, city, country} = req.body;

        const user = await User.findById(req.userId);

        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.addressLine2 = addressLine2;
        user.city = city;
        user.country = country;

        await user.save();
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "There is an error while updating user!"})
    }
};

export default {getUser, createUser, updateUser};