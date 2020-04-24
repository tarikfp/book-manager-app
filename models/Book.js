const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    bookName:{
        type:String,
        /* validate(value){
            if(validator.isEmpty(value)){
                throw new Error("Book Name Field Can not be Empty !");
            }
        } */

    },
    author:{
        type:String,
        /* validate(value){
            if(validator.isEmpty(value)){
                throw new Error("Book Author Field Can not be Empty !");
            }
        } */
    },
   
    publisher:{
        type:String,
        required:true
    },
    bookCategory:{
        type:String,
        /* validate(value){
            if(validator.isEmpty(value)){
                throw new Error("Book Category Field Can not be Empty !");
            }
        } */

    },
    bookOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
})


bookSchema.virtual("users",{
    ref: "User",
    localField: "_id",
    foreignField: "favorites"
})



bookSchema.methods.toJSON = function(){
    const book = this
    const bookObject = book.toObject()
    
    return bookObject

}









const Book = mongoose.model("Book",bookSchema)

module.exports = Book