import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import {singleUpload}  from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);//as  want to upload imagse so used singleUpload middleware(multer)
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post( isAuthenticated ,singleUpload,updateProfile);//so that only authenticated users can update their profile

export default router;
