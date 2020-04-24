/* const CustomStrategy = require("passport-custom").Strategy
const passport = require("passport")
const bcrypt = require("bcryptjs")
const User = require("../../models/User")


// Basic example for passport-custom from passport.js

/* passport.use(new CustomStrategy(
    function(req, done) {
      User.findOne({
        username: req.body.username
      }, function (err, user) {
        done(err, user);
      });
    }
  ));
 */
/* 
passport.use(new CustomStrategy((schoolNo,password,done)=>{
 
    User.findOne({schoolNo},(err,user)=>{
        if(err) return done(err,null,"An error has occured in Custom Strategy")
        
        if(!user){
            return done(null,false,"User Not Found !")
        }

        bcrypt.compare(password,user.password,(err,res)=>{
            if(res){//password ve user.password eşleşiyorsa true döner

                return done(null,user,"Successfully Logged In")
            }
            else{
                return done(null,false,"Invalid Password")
            }
        })
    })
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user.toJSON());
    });
  });  */