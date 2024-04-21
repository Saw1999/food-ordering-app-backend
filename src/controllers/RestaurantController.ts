import {Request, Response} from "express";
import Restaurant from "../models/restaurant";

//searching restaurants
const searchRestaurants = async(req: Request, res: Response) => {
    try{
        const city = req.params.city;

        const searchQuery = req.query.searchQuery as string || "";
        const selectedDishes = req.query.selectedDishes as string || "";
        const sortOption = req.query.sortOption as string || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {};

        query["city"] = new RegExp(city, "i");
        const cityCheck = await Restaurant.countDocuments(query);

        if(cityCheck === 0) {
            return res.status(404).json({
                data:[],
                pagination: {
                    totalResta : 0,
                    page: 1,
                    pages: 1,
                },
            });
        }

        if(selectedDishes) {
            const dishesArray = selectedDishes.split(",").map((dish) =>new RegExp(dish, "i"));
            
            query["dishes"] = {$all: dishesArray}
        }

        if(searchQuery) {
            const searchRegExp = new RegExp(searchQuery, "i");
            query["$or"] = [
                {restaurantName: searchRegExp},
                {dishes: {$in: [searchRegExp]}},
            ];
        }

        const pageSize = 10;
        const skip =(page - 1 ) * pageSize;

        const restaurants = await Restaurant.find(query).sort({[sortOption]: 1}).skip(skip).limit(pageSize).lean();
        const totalResta = await Restaurant.countDocuments(query);

        const searchRes = {
            data: restaurants,
            pagination: {
                totalResta, // total count of the records
                page, // current page we are on
                pages: Math.ceil(totalResta/pageSize) // total pages
            },
        };

        res.json(searchRes);
    }
    catch(err){
        console.log("error: ", err);
        res.status(500).json({message: "Something went wrong!"})
    }
};

// get a single restaurant
const getRestaurant = async(req: Request, res: Response) => {
    try{
        const restaurantId = req.params.restaurantId;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({message: "Restaurant not found!"});
        }

        res.json(restaurant);
    }
    catch (err) {
        console.log("error: ", err);
        res.status(500).json({message: "Something went wrong when fetching a restaurant!"})
    }
};

export default {searchRestaurants, getRestaurant};