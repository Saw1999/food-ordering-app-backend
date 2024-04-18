// middleware for validation

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async(req: Request, res: Response, next: NextFunction) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    next();
};


export const validateUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string!"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string!"),
    body("addressLine2").optional().isString().withMessage("AddressLine2 must be a string!"),
    body("city").isString().notEmpty().withMessage("City must be a string!"),
    body("country").isString().notEmpty().withMessage("Country must be a string!"),
    handleValidationErrors,
];


export const validateRestaurantRequest = [
    body("restaurantName").isString().notEmpty().withMessage("Restaurant Name must be a string!"),
    body("suburb").isString().notEmpty().withMessage("Suburb must be a string!"),
    body("city").isString().notEmpty().withMessage("City must be a string!"),
    body("country").isString().notEmpty().withMessage("Country must be a string!"),
    body("deliFee").isFloat({min: 0}).withMessage("Delivery Fee must be a postive number!"),
    body("estiDeliTime").isInt({min: 0}).withMessage("Delivery Time must be a positive integer!"),
    body("dishes").isArray().withMessage("Dishes must be a string!").not().isEmpty().withMessage("Dishes array cannot be empty!"),
    body("menuItems").isArray().withMessage("Menu Items must be an array!"),
    body("menuItems.*.name").notEmpty().withMessage("Menu Item's name is required!"),
    body("menuItems.*.price").isFloat({min: 0}).withMessage("Menu Item's price is required and must be a positive number!"),
    handleValidationErrors,
];