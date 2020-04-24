const formValidation = require("../validation/formValidation")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Book = require("../models/Book")
const passport = require("passport")
const mongoose = require("mongoose")
const uuid = require("uuid")
const sgMail = require("@sendgrid/mail")
const multer = require("multer")
const sharp = require("sharp")
const {sendResetLink,sendWelcomeEmail} = require("../email/pwresetmail")
const {createResetRequest, getResetRequest} = require("../email/requests")
const path = require("path")

const sequelize = require("sequelize")
const Op = sequelize.Op


require("../authentication/passport/local")
require("../authentication/passport/custom")




module.exports.getUserLogout = (req, res, next) => {
    req.logout()
    req.flash("success", "Successfully Logged Out")
    res.redirect("/login",)
}



module.exports.getUserLogin = (req, res, next) => {

    res.render("pages/login",{style:"signuptry.css",js:"signuptry.js",layout : "other", title : "Login"})
}

module.exports.getUserRegister = (req, res, next) => {

    res.render("pages/register",{style:"signuptry.css",js:"signuptry.js",layout : "other", title : "Register"})
}

module.exports.postUserLogin = (req, res, next) => {

    //req.flash("error") failureFlash messageları req.flash("error")da tutuluyor
    //req.flash("success") failureSuccess messageları req.flash("success")de tutuluyor

  /*   passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    })(req, res, next) */

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    })(req, res, next)


}

module.exports.postUserRegister = async (req, res, next) => {

    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const validationErrors = formValidation.registerValidation(firstname,lastname, username, password, email)
    const errors = []

    if (validationErrors.length > 0) {
        return res.render("pages/register", {
            firstname : firstname,
            lastname : lastname,
            username: username,
            email : email,
            errors: validationErrors,
            style:"signuptry.css",
            js:"signuptry.js",
            layout: "other",
            title : "Register"
        })
    }
   
    const userUsername = await User.findOne({username : username})
    const userEmail = await User.findOne({email:email})
    if(userUsername){
        errors.push({
            message: "School Number Already In Use"
        })    }
    if(userEmail){
        errors.push({
            message: "E-Mail Already In Use"
        })
    }

    if(errors.length>0){
        return res.render("pages/register", {
            firstname : firstname,
            lastname : lastname,
            username: username,
            email : email,
            errors: errors,
            style:"signuptry.css",
            js:"signuptry.js",
            layout:"other",
            title : "Register"
        })
    }

    /* console.log(errors);
    User.findOne({
            username : username
        })
        .then(user => {
            if (user) {
                errors.push({
                    message: "School Number Already In Use"
                })
                
                return res.render("pages/register", {
                    firstname : firstname,
                    lastname : lastname,
                    username: username,
                    email : email,
                    errors: errors,
                    style:"signuptry.css",
                    js:"signuptry.js",
                    layout:"other",
                    title : "Register"
                })
            } */

            


            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        throw new err;
                    }

                    const user = new User({
                        firstname : firstname,
                        lastname : lastname,
                        username: username,
                        password: hash,
                        email : email,
                        avatar : "placeholders/usrplaceholder.jpg"
                    })

                        

                    user.save().then(() => {
                            req.flash("flashSuccess", "Successfully Registered")
                            res.redirect("/")
                        })
                        .catch(err => console.log(err))
                        
                        sendWelcomeEmail(email,firstname)

                });
            })

/*         }).catch(err => console.log(err))
 */
    /* 
     */

}

module.exports.getUserAddBook = (req, res, next) => {

    res.render("pages/addbook",{title:"Add Book"})

}



module.exports.postUserAddBook = (req, res, next) => {

    const bookName = req.body.bookName
    const author = req.body.author
    const publisher = req.body.publisher
    const bookCategory = req.body.bookCategory

    errors = []
    const validationErrors = formValidation.addBookValidation(bookName, author, publisher, bookCategory)


    if (validationErrors.length > 0) {
        return res.render("pages/addbook", {
            bookName: bookName,
            author: author,
            publisher: publisher,
            bookCategory: bookCategory,
            errors: validationErrors
        })
    }
    const book = new Book({
        ...req.body,
        bookOwner: req.user._id
    })

    book.save().then(() => {
            req.flash("flashSuccess", "Book successfully added in your profile !")
            res.redirect("/addbook")
        })
        .catch(err => console.log("User save failed !"))


}


module.exports.getUserProfile = (req, res, next) => {

    


    User.findOne({_id: req.user._id }).lean().populate("favorites").exec((err, user) => {
        if(err){
            console.log("An error has occured while viewing favorites");
        }
        if(user==""){
            console.log("User is Empty");
        }
        else{
         
            Book.find({bookOwner: req.user._id }).lean().then(book => {
            if (book) {
                return res.render("pages/userprofile", {books: book,favBooks : user.favorites,title:user.firstname+" Profile"})
             } else {
                return res.render("pages/userprofile", {books: "You have no added books !",title:user.firstname+" Profile"})
            }
            }).catch(err => console.log(err))

        }


    })


}


module.exports.getFindBooks = async (req, res, next) => {
    const {term} = req.query
    const validationErrors = formValidation.findBooksValidation(term)

    if (validationErrors.length > 0) {
        return res.render("pages/index", {
            errors: validationErrors,
            title : "Main Page"
        })
    }

    Book.find({bookName: {$regex: term, $options: 'i'}, bookOwner : {$ne : req.user._id} }).lean().populate("bookOwner").exec((err, books) => {
        if (err) {
            return res.render("pages/index", {
                errors: "An error has occured when finding book",
                title : "Main Page"
            })
        }
        if (books == "") {
            res.render("pages/index", {
                noBooks: "No Book Found In Your Criteria",
                title : "Main Page"
            })
        } else {
            res.render("pages/index", {
                books: books,
                title : "Main Page"

            })
        }
    })
}
/*   const book = await Book.find({
      bookName: term
  }).lean()

  if (book == "") {
      res.render("pages/index", {
          noBooks: "No Book Found In Your Criteria"
      })
  } else {
      res.render("pages/index", {
          books: book
      })
  } */





/*  var bookOwnerInfo = [] */
/*  for (var i = 0; i<book.length ; i++ ){
     bookOwnerInfo.push(await User.find({_id : book[i].bookOwner}).lean())
     // Do not use const here. If you use const, you would not be able to
     // reach bookOwnerInfo outside of for loop !

 } */




module.exports.getViewOwner = async (req, res, next) => {

    const id = req.query.b

    const bookOwner = await User.findById({_id : id}).lean()
     const bookOwnerBooks = await Book.find({
        bookOwner: id
    }).lean() 

    res.render("pages/viewowner", {
        bookOwner: bookOwner,
        bookOwnerBooks : bookOwnerBooks,
        title : bookOwner.firstname+" Profile"

    })

}

module.exports.getFavBooks = async (req, res, next) => {
    const bookID = req.query.b
    const user = await User.getUser(req.user._id)
    const book = await Book.findOne({_id : bookID}).lean()
   /*  const checkBook = await Book.find({bookOwner : req.user._id}).lean()
 
    if(checkBook.includes(book)){
        req.flash("error","")
    } */
    if(user.favorites.includes(bookID)){
        req.flash("error",`You have already added ${book.bookName} book to your favorites`)
        res.redirect("/")
    }
    else{
    user.favorites.push({_id : bookID})
    //user.favorites = user.favorites.concat({favs : bookID})

    user.save()
    req.flash("success",`${book.bookName} book has successfully added to your favorite book list`)
    res.redirect("/userprofile")
    }
}


module.exports.removeFavBook = async (req,res,next)=>{

    const bookID = req.query.b
    const book = await Book.findById({_id : bookID})
    const user = await User.findById({_id : req.user._id})
    const bookIDobj = mongoose.Types.ObjectId(bookID);
    
   

    user.favorites.remove(bookIDobj);
    user.save();

    req.flash("success",`${book.bookName} book has succesfully deleted from your favorites`)
    res.redirect("/userprofile") 
}

module.exports.deleteMyBook = async(req,res,next)=>{

    const bookID = req.query.b

    const deletedBook = await Book.findByIdAndDelete({_id : bookID})
    const deletedBookName = deletedBook.bookName

    req.flash("success",`You successfully deleted ${deletedBookName} book`)
    res.redirect("/userprofile")
    

}

module.exports.postUserUpdateEmail = async(req,res,next)=>{
    const email = req.body.email
    const newemail = req.body.newemail

    if(email==req.user.email){
        const user = await User.findByIdAndUpdate({_id : req.user._id},{email:newemail})
        user.save()
        req.flash("success","Your email has successfully updated")
        res.redirect("/userprofile")
    }
    else{
        req.flash("error","Make sure all credentials are true !")
        res.redirect("/userprofile")
    }
}

module.exports.postUserUpdateFirstname = async(req,res,next)=>{
    const firstname = req.body.firstname
    const user = await User.findByIdAndUpdate({_id : req.user._id},{firstname:firstname})
    user.save()
    req.flash("success","Your firstname has successfully updated")
    res.redirect("/userprofile")

}

module.exports.postUserUpdateLastname = async(req,res,next)=>{
    const lastname = req.body.lastname
    const user = await User.findByIdAndUpdate({_id : req.user._id},{lastname:lastname})
    user.save()
    req.flash("success","Your lastname has successfully updated")
    res.redirect("/userprofile")

}

module.exports.postUserUpdatePassword = async(req,res,next)=>{
    const oldPassword = req.body.oldpassword
    const newPassword = req.body.newpassword

   const isMatched = await  bcrypt.compare(oldPassword, req.user.password)
   console.log(isMatched);
   if(isMatched){
    const newHashedPassword = await bcrypt.hash(newPassword,8)
    const user = await  User.findByIdAndUpdate({_id:req.user._id},{password:newHashedPassword})
    user.save()
    req.flash("success","Your password has been successfully updated")
    res.redirect("/userprofile")
    }
    else{
    req.flash("error","Make sure your previous password is correct")
    res.redirect("/userprofile")
    }

/* FOR ASYNC ==>  const hashedPass = await bcrypt.hash(pass,8)
   const isTrue = await bcrypt.compare(pass,hashedPass) */

}

module.exports.getForgotPw = async(req,res,next)=>{
    res.render("pages/forgotpw",{style:"signuptry.css",js:"signuptry.js",layout : "other", title : "Forgot Password"})
}
  


module.exports.forgotPwReset = async(req,res,next)=>{
    const thisEmail = req.body.email
    const id = uuid.v4()

    const checkEmail = await User.findOne({email:thisEmail})
    if(checkEmail == null){
        req.flash("error","The E-Mail You Entered is Not Registered to Our System")
        return res.redirect("/forgotpw")
    }
    console.log("uuid.v4 id'si",id);
    
    const request = {
        id : id,
        email : thisEmail
    }
    createResetRequest(request)
    sendResetLink(thisEmail,id)

    req.flash("success","Password reset link has successfully sent to your E-Mail Box. Please check your e-mail")
    res.redirect("/forgotpw")
    
}

module.exports.getReset = async (req,res,next)=>{
    const thisRequest =  getResetRequest(req.params.id); 
    

    if(thisRequest){
        res.render("pages/passwordrenew",{thisRequest,style:"signuptry.css",js:"signuptry.js",layout : "other", title : "Password Reset"})
    }
    else{
        req.flash("error","Error While Resetting Password")
        res.redirect("/forgotpw")
    }


}

module.exports.postPasswordRenew = async(req,res,next)=>{
    const email = req.params.email
    console.log(email);
    
    const password = req.body.newpassword
    const hashedPass = await bcrypt.hash(password,8)
    
    const user = await User.findOneAndUpdate({email:email},{password : hashedPass})
    user.save()
    req.flash("success","Your password has been successfully updated to new one!")
    res.redirect("/login")

}


module.exports.postUploadAvatar = async(req,res,next)=>{
    
    //Set Storage Engine
    const storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : function(req, file, cb){
        cb(null,file.fieldname + "-" + Date.now() +
         path.extname(file.originalname))
    }
})

    const upload = multer({
        limits : {fileSize : 1000000 }, //1 mb
        storage : storage,
        fileFilter : function(req, file, cb){
            checkFileType(file,cb);
        }
    }).single("image")


    function checkFileType(file,cb){
        //Allowed extension
        const fileTypes = /jpeg|jpg|png|gif/;

        //Check extension
        const extname = fileTypes.test
        (path.extname(file.originalname).toLowerCase())

        //Check mime type
        const mimeType = fileTypes.test(file.mimetype)

        if(mimeType && extname){
            return cb(null,true)
        }
        else{
            cb("Error : Images Only!")
        }
    }

      
    upload(req,res,(err)=>{
        if(err ){
            console.log(err);
            req.flash("error",`${err}`)
            res.redirect("/userprofile")
        }
        else{
            if(req.file == undefined){
                req.flash("error","No File Selected")
                res.redirect("/userprofile")
            }
            else{
               User.findById(req.user._id,function(err,user){
                
                const resizedPath = `./public/resized/${req.file.filename}`
                const sendPath = resizedPath.replace("./public/","")
                user.avatar = sendPath
                user.save()
               sharp(req.file.path).resize(150,150).toFile(resizedPath)
               .then(
                   resizedPath=> req.flash("success","Photo uploaded successfully !") ,res.redirect("/userprofile")
                   )
               .catch( err => console.log(err))
            })

            }


        }

}

)}



module.exports.userDeleteAvatar = async(req,res,next)=>{
    
    const user = await User.findById(req.user._id)
    user.avatar = "placeholders/usrplaceholder.jpg"
    user.save()
    req.flash("success","Photo has successfully removed from your profile")
    res.redirect("/userprofile")
}










/* 

    const buffer = await sharp(req.file.buffer).resize(150,150).toBuffer()
    req.user.avatar = buffer
    await req.user.save() */










/* 
router.post("/users/me/avatar",auth,upload.single("avatar"), async(req,res)=>{
    
    const buffer = await sharp(req.file.buffer).resize(250,250).toBuffer()
    req.user.avatar = buffer
    await req.user.save()

    res.status(200).send("Uploading file process is succesfully ended !")

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.get("/users/:id/avatar",async(req,res)=>{
    
    try {
        
        const user = await User.findById(req.params.id)

    if(!user||!user.avatar){
        throw new Error()
    }
        res.set("Content-Type","image/jpg")
        res.send(user.avatar)
        
    }
    catch (err) {
        res.status(404).send(err)
    }

    
})

router.delete("/users/me/avatar",auth,async(req,res)=>{
     req.user.avatar = undefined
     await req.user.save()
     res.status(200).send("The Image Succesfully Deleted")
})

 */