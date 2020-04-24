module.exports.registerValidation = (firstname,lastname,username,password,email,schoolNo)=>{

    const errors = []
    if(firstname === ""){
        errors.push({message : "Please fill the First Name area"})
    }
    if(lastname === ""){
        errors.push({message : "Please fill the Last Name area"})
    }
    if(username === ""){
        errors.push({message : "Please fill the School Number area"})
    }
    if(password === ""){
        errors.push({message: "Please fill the Password Area"})
    }
    if(email === ""){
        errors.push({message: "Please fill E-mail area"})
    }
   
    if(password.length<6){
        errors.push({message : "Password Minimum Length Must be 6"})
    }

    return errors
}


module.exports.addBookValidation = (bookName,author,publisher,bookCategory)=>{

    const errors = []
    if(bookName === ""){
        errors.push({message : "Please fill the Book Name area"})
    }
    if(author === ""){
        errors.push({message: "Please fill the Author area"})
    }
    if(publisher === ""){
        errors.push({message: "Please fill the Publisher area"})
    }
    if(bookCategory === ""){
        errors.push({message: "Please fill the Book Category area"})
    }


    return errors
}


module.exports.findBooksValidation = (term) =>{
    const errors = []

    if(term ===""){
        errors.push({message : "Please Enter a Book Name !"})
    }

    return errors
}