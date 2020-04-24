const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const bcrypt = require("bcryptjs")
const User = require("../../models/User")


passport.use(new LocalStrategy((username,password,done)=>{

    User.findOne({username},(err,user)=>{

        if(err) return done(err,null,"An error has occured in Local Strategy")
        
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
  });