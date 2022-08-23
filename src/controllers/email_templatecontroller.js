const template = require("../models/emailtemplateSchema");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
class Template{
    async addemailtemplate(req,res){
        try{
        const emailtext=req.body.emailtext;
        const templatename=req.body.templatename;
        const data={
            emailtext:emailtext,
            templatename:templatename
        }
        const savedata=new template(data);
        savedata.save().then((result)=>{
        return res.status(200).json('Add successfully');
        });
        }catch(error){
            console.log(error)
        }
    }
    async test(req,res){
        const data1=await template.findOne({_id:"629709d2778dcbacfb102a54"})
        const emaildata=data1.emailtext;
        
        // var smtpTransport = require("nodemailer-smtp-transport");
         
        // var transporter = nodemailer.createTransport(
        //   smtpTransport({
        //     service: "gmail",
        //     auth: {
        //       user: "info@esports4g.com", // my mail
        //       pass: "Gaming@esports4g",
        //     },
        //   })
        // );
        // transporter.sendMail({
        //   to: "himanshuroox@gmail.com",
        //   from: "info@esports4g.com",
        //   subject: "User Status",
        //   html: emaildata
        // });
       
        sgMail.setApiKey(
            "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"
          );
          const data='himanshu'
          const msg = {   
            to: "himanshuroox@gmail.com",
            from: "info@esports4g.com", // Change to your verified sender
            subject: "Registration successful ",
            text: "Registration successful ",
            html: `${emaildata}`,
          };
          sgMail.send(msg).then(() => {
            console.log("Email sent");
          });
        return res.status(200).json("DONE")
    }
    async edittemplate(req,res){
        const id=req.params.id;
        try{
         const data=await template.findOne({_id:id});
         if(!data){
            return res.status(200).json("No data found")  
         }else{
            return res.status(200).json(data)   
         }
        }catch(error){
            console.log(error)
        }
    }
}
module.exports=new Template();