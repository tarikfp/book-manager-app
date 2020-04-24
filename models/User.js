const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    firstname:{
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    username:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    favorites:[{
            
            type : mongoose.Schema.Types.ObjectId,
            ref : "Book"
        
    }],
    avatar:{
        type : String
    }
        
},{
    timestamps:true
})



userSchema.virtual("books",{
    ref: "Book",
    localField: "_id",
    foreignField: "bookOwner"
})



userSchema.methods.favBooks = function(favoriteBook){
  
    const user = this
    user.favorites = []
    user.favorites.push(favoriteBook)
    return user.favorites

   
}

userSchema.statics.getUser = async(userID)=>{

    const user = await User.findById({_id : userID})

        return user
    

}


/* userSchema.pre('save', function (next) {
    var self = this;
    User.find({email : this.email}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error("Email exists!"));
        }
    });
}) ; */


const User = mongoose.model("User",userSchema)

module.exports = User