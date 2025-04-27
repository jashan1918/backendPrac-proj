import {Router} from "express" 
import {loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

//Secured Routes

router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("change-password").post(verifyJwt, changeCurrentPassword)
router.route("/get-user").get(verifyJwt, getCurrentUser)

export default router 