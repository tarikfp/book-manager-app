const express = require("express")
const app = express()
const exphbs = require("express-handlebars")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const userRouter = require("./routes/user")
const path = require("path")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/User")
const flash = require("connect-flash")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const multer = require("multer")

const PORT = process.env.PORT  //config dosyasındaki dev.env deki PORT variable ından değerini alır localde çalışırken ..!
const hbs = exphbs.create({
helpers:{
    
    ifEquals: function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }

})




const publicDirPath = path.join(__dirname,"/public")

app.use(express.static(publicDirPath))
app.use((err, req, res, next) => {
    if (err) {
      return res.send("An error has occured")
    }
    next();
  });

//flash middleware
app.use(cookieParser(process.env.PASSPORT_KEY)) //process.env.key olcak
app.use(
    session({ 
        cookie: { maxAge: 600000 },
        resave:true, secret : process.env.PASSPORT_KEY,
        saveUninitialized: true
    }));

app.use(flash())

//Passport initialize - Flashın hemen altında olsun - Password kullanmak için yapılan işlemler
//Passport middleware olarak girecek fonksiyonlarımıza
app.use(passport.initialize())
app.use(passport.session())

//Global - Res.Locals - Middleware
app.use((req,res,next)=>{
    //Our own flash
    
    res.locals.flashSuccess = req.flash("flashSuccess")
    res.locals.flashError = req.flash("flashError")
    

    //Passport Flash
    res.locals.passportFailure = req.flash("error")
    res.locals.passportSuccess = req.flash("success")

    //Our Logged In User
    
    res.locals.user = req.user
    
    
    next()
})





//database connect
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true});

const db = mongoose.connection
db.on("Error on database",console.error.bind(console,"Connection Error"))
db.once("open",()=>{
    console.log("Connected to Database");
})


app.engine("handlebars",hbs.engine)
app.set("view engine","handlebars")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRouter) // User Router body parser'dan sonra olmak ZORUNDA !






app.get("/",checkAuthenticated,(req,res)=>{
    User.find({}).lean().then(users=>{//use lean() for handlebars error
        res.render("pages/index",{users:users,title:"Main Page"})
    }).catch(err=>console.log(err))
})

/* app.get("*",(req,res)=>{
    res.render("static/404")
})
 */
app.use((req,res)=>{
    res.render("static/404")
})




function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect("/login")
}




app.listen(PORT,()=>{
    console.log("Server is up and running on PORT",PORT);
})