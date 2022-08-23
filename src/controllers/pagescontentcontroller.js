const Contactus = require("../models/contactusSchema");
const Abooutus = require("../models/aboutusSchema");
const sgMail = require("@sendgrid/mail");      
const Company = require("../models/companydetailSchema");
class Pages {
async addcompanydetails(req,res){
   try{
     const contactusheading=req.body.contactusheading;
     const mobile=req.body.mobile;
     const address=req.body.address;
     const esportsemail=req.body.esportsemail;
     const data={
        contactusheading:contactusheading,
        mobile:mobile,
        address:address,
        esportsemail:esportsemail,
     }
     const datasave=new Company(data);
     datasave.save().then((result)=>{
        return res.status(200).json('data save successfully');
     })

   }catch(error){
    console.log(error)
   }
}
async editcmpnydetails(req,res){
    try{
     const data=await Company.findOne({});
     if(!data){
        return res.status(400).json('No data found');
     }else{
        return res.status(200).json(data); 
     }
    }catch(error){
        console.log(error)
    }
}

async updatecmpnydetails(req,res){
    try{
        const id=req.params.id;
      const contactusheading=req.body.contactusheading;
      const mobile=req.body.mobile;
      const address=req.body.address;
      const esportsemail=req.body.esportsemail;
      const data={}
         data.contactusheading=contactusheading
         data.mobile=mobile
         data.address=address
         data.esportsemailesportsemail
      await Company.findByIdAndUpdate(id,data).then((result)=>{
         return res.status(200).json('data update successfully');
      })
 
    }catch(error){
     console.log(error)
    }
 }
 async submitcontactus(req,res){
     try{
        const username=req.body.username;
        const useremailemail=req.body.useremailemail;
        const subject=req.body.subject;
        const message=req.body.message;
        const data={
            username:username,
            useremailemail:useremailemail,
            subject:subject,
            message:message,
         }
         const datasave=new Contactus(data);
         datasave.save().then((result)=>{
            sgMail.setApiKey(
                "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"
              );
              const msg = {
                to: 'admin@esports4g.com',
                from: "info@esports4g.com", // Change to your verified sender
                subject: "Contact Us Request",
                text: " ",
                html: `UserName:${username}<br/>
                Email:${useremailemail}<br/>
                Message: ${message}`,
              };
              sgMail.send(msg).then(() => {
                console.log("Email sent");
              });
            //   res.status(201).json({ message: "user registetred sucessfully" });


            return res.status(200).json('data save successfully');
         })

     }catch(error){
        console.log(error)
     }
 }
 async addaboutus(req,res){
    try{
      const imagesicon=[];
      const middleparaarray=[];
      const middleheadingarray=[];
      const lastheadingarray=[];
      const imagesicon1=[];
      const topheading=req.body.topheading;
      const taglineheading=req.body.taglineheading;
      const taglineparagraph=req.body.taglineparagraph;
      const toppara=req.body.toppara;
      const record1=req.body.record1;
      const record2=req.body.record2;
      const record3=req.body.record3;
      const record4=req.body.record4;
      const middleheading=JSON.parse(req.body.middleheading);
       const lastheading=JSON.parse(req.body.lastheading);
      const middlepara=JSON.parse(req.body.middlepara);
      const bottoumheading=req.body.bottoumheading;
        let topimage = req.files.topimage[0].location;
        const filedata = req.files.middleicon;
        for await (const file of filedata) {
          const results = file.location;
          imagesicon.push(results);
          middleparaarray.push(middlepara)
          middleheadingarray.push(middleheading);
        }
        const filedata1 = req.files.lasticon;
        for await (const file1 of filedata1) {
         const results1 = file1.location;
         imagesicon1.push(results1);
         lastheadingarray.push(lastheading)
      
       }
      //   let middleicon = req.files.middleicon[0].location;
      const data={
        topheading:topheading,
        toppara:toppara,
        record1:record1,
        record2:record2,
        record3:record3,
        record4:record4,
        middleheading:middleheadingarray,
        middlepara:middleparaarray,
        bottoumheading:bottoumheading,
        topimage:topimage,
        taglineheading:taglineheading,
        taglineparagraph:taglineparagraph,
        middleicon:imagesicon,
        lastheading:lastheadingarray,
        lasticon:imagesicon1
      }
      const datasave=new Abooutus(data);
      datasave.save().then((result)=>{
         return res.status(200).json('data save successfully');
      })
    }catch(error){
     console.log(error)
    }
 }
 async editaboutus(req,res){
    try{
        const data=await Abooutus.findOne({});
        if(!data){
           return res.status(400).json('No data found');
        }else{
           return res.status(200).json(data); 
        }
       }catch(error){
           console.log(error)
       }
 }
async updateaboutus(req,res){
    try{
      const output=[];
      const middleparaarray=[];
      const middleheadingarray=[];
      const lastheadingarray=[];
      const output1=[];
        const id=req.params.id;
        const topheading=req.body.topheading;
        const toppara=req.body.toppara;
        const record1=req.body.record1;
        const record2=req.body.record2;
        const record3=req.body.record3;
        const record4=req.body.record4;
        const taglineheading=req.body.taglineheading;
        const taglineparagraph=req.body.taglineparagraph;
        const middleheading=JSON.parse(req.body.middleheading);
        const middlepara=JSON.parse(req.body.middlepara);
        const lastheading=JSON.parse(req.body.lastheading);
        const bottoumheading=req.body.bottoumheading;
        const filedata = req.files.middleicon;
        
          
      if(req.files.middleicon){
        for await (const file of filedata) {
          const results = file.location;
          output.push(results);
        }
      }
        const filedata1 = req.files.lasticon;
        
      //   console.log(req.body)
      if(req.files.lasticon){
        for await (const file of filedata1) {
          const results1 = file.location;
          output1.push(results1);
        }
      }
         var i = req.body.imageindex;
         var i1 = req.body.lastimageindex;
        const updatepage={$set: {}}
        updatepage.topheading=topheading
        updatepage.toppara=toppara
        updatepage.record1=record1
        updatepage.record2=record2
        updatepage.record3=record3
        updatepage.record4=record4
        updatepage.taglineheading=taglineheading
        updatepage.taglineparagraph=taglineparagraph
        if(middleheading){
         for await (const head of middleheading) {
            middleheadingarray.push(head);
          }
          updatepage.middleheading=middleheadingarray
       }
       if(middlepara){
         for await (const para of middlepara) {
            middleparaarray.push(para);
          }
          updatepage.middlepara=middleparaarray
       }
       if(lastheading){
         for await (const lasthead of lastheading) {
            lastheadingarray.push(lasthead);
          }
          updatepage.lastheading=lastheadingarray
       }
       updatepage.bottoumheading=bottoumheading
        if (req.files.topimage) {
          let topimage = req.files.topimage[0].location;
          updatepage.topimage = topimage;
        }
     
        if (req.body.imageindex) {
         for(let j=0;j<i.length;j++){
             if(i[j]!='undefined'){
               if(i.length!=output.length){
               for(let v=0;v<output.length;v++){
             const filelink = output[v];
                updatepage.$set["middleicon." + i[j]] = filelink;  
               }
             }else{
               const filelink = output[j];
               updatepage.$set["middleicon." + i[j]] = filelink;  
             }
         }
       }
       }
       if (req.body.lastimageindex) {
         for(let j=0;j<i1.length;j++){
            
             if(i1[j]!='undefined'){
               if(i1.length!=output1.length){
               for(let v=0;v<output1.length;v++){
             const filelink = output1[v];
                updatepage.$set["lasticon." + i1[j]] = filelink;  
               }
             }else{
               const filelink = output1[j];
               updatepage.$set["lasticon." + i1[j]] = filelink;  
             }
         }
       }
       }
      //   if (req.files.middleicon) {
      //     let middleicon = req.files.middleicon[0].location;
      //     data.middleicon = middleicon;
      //   }
        await Abooutus.findByIdAndUpdate(id,updatepage).then((result)=>{
            return res.status(200).json('data update successfully');
         })
    }catch(error){
       console.log(error)
    }
}
}
    module.exports = new Pages();