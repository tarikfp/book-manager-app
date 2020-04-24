const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.sendResetLink = (email,id)=>{

    sgMail.send({
        to : email,
        from : "tarikfatihakdenizunibookadmin@akdeniz.com" ,
        subject : "Password Reset",
        html : `Hi there ! This is admin of AkdenizUniBook. To reset your password please click on this <a href=" http://localhost:3000/reset${id}">link</a>`,
        
    })
}



module.exports.sendWelcomeEmail = (email,name)=>{

    sgMail.send({
        to : email,
        from : "tarikfatihakdenizunibookadmin@akdeniz.com" ,
        subject : "Welcome Message",
        html : ` Hey ${name} ! Welcome to Our Application. If you have any questions to ask just click <a href="http://websiteniziyapiyorum.com">here</a>`
    })

} 

module.exports.sendLeavingEmail = (email,name)=>{
    sgMail.send({
        to : email,
        from : "tarikfatihakdenizunibookadmin@akdeniz.com",
        subject : "Leaving Message",
        html : `<h1> We are sorry to hear you are leaving ${name} ! Please let us know if anything bad happened. <a href='websiteniziyapiyorum.com'>Let Us Know</a>`

    })
}













/* const sendWelcomeEmail = (email,name)=>{

    sgMail.send({
        to : email,
        from : "nodejsceo@hotmail.com" ,
        subject : "Welcome Message",
        html : `<h1> Hey ${name} ! Welcome to Our Application. If you have any questions to ask just click <a href='websiteniziyapiyorum.com'>here</a>`
    })

} 

const sendLeavingEmail = (email,name)=>{
    sgMail.send({
        to : email,
        from : "nodejsceo@hotmail.com",
        subject : "Leaving Message",
        html : `<h1> We are sorry to hear you are leaving ${name} ! Please let us know if anything bad happened. <a href='websiteniziyapiyorum.com'>Let Us Know</a>`

    })
}

 */

/* sgMail.send({
    to: 'tarikpnr147@gmail.com',
    from: 'nodejs@hotmail.com',
    subject: 'Burası subject alanı nodee js',
    text: 'Burası text area node js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }) */


  