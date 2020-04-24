const express = require("express")
const userController = require("../controllers/userController")
const sequelize = require("sequelize")
const Op = sequelize.Op
const User = require("../models/User")
const Book = require("../models/Book")

const router = express.Router()

router.get("/login",userController.getUserLogin)

router.get("/register",userController.getUserRegister)

router.get("/addbook",userController.getUserAddBook)

router.post("/addbook",userController.postUserAddBook)

router.get("/userprofile",userController.getUserProfile)

router.get("/logout",userController.getUserLogout)

router.post("/login",userController.postUserLogin)

router.post("/register",userController.postUserRegister)

router.get("/booksearch",userController.getFindBooks)

router.get("/viewowner",userController.getViewOwner)

router.get("/addfavorites",userController.getFavBooks)

router.get("/removefav",userController.removeFavBook)

router.get("/deletemybook",userController.deleteMyBook)

router.post("/userupdateemail",userController.postUserUpdateEmail)

router.post("/userupdatefirstname",userController.postUserUpdateFirstname)

router.post("/userupdatelastname",userController.postUserUpdateLastname)

router.post("/userupdatepassword",userController.postUserUpdatePassword)

router.get("/forgotpw",userController.getForgotPw)

router.post("/forgotpwreset",userController.forgotPwReset)

router.get("/reset:id",userController.getReset)

router.post("/pwrenew/email:email",userController.postPasswordRenew)

router.post("/uploadphoto",userController.postUploadAvatar)

router.get("/userdeleteavatar",userController.userDeleteAvatar)

/* router.get("/signuptry",(req,res)=>{
    res.render("pages/signuptry",{style:"signuptry.css",js:"signuptry.js"})
})
 */





module.exports = router;