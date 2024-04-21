import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

//get a single restaurant
router.get(
    "/:restaurantId", 
    param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurant ID parameter must be a valid string!"),
    RestaurantController.getRestaurant
)

//get restaurants for searching 
router.get(
    "/search/:city", 
    param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string!"),
    RestaurantController.searchRestaurants
)

export default router;