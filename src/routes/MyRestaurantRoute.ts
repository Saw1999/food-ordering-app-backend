import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/validation";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    },
});

//get restaurant
router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

//create a restaurant
router.post("/", upload.single("imageFile"), validateRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.createRestaurant);

//update restaurant
router.put("/", upload.single("imageFile"), validateRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.updateRestaurant);

export default router;