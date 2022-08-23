const Messages = require("../models/messageModel");
const MyChat = require("../models/mychatSchema");
const User = require("../models/userSchema");
const welcomechat = require("../models/chatwelcomeSchema");
class Chat{
 async getMessages(req, res, next) {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        messages: msg.message.file,
      };
    });                                                       
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

async addMessage(req, res, next){
     console.log(req.files)
     console.log(req.body)
   const output = [];
  try {
    const { from, to, message } = req.body;
    
    if(req.files.length!=0) {
      const filedata = req.files;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
      // const chatimage = req.files.chatimage[0].location;
      const data = await Messages.create({
      message: { file: output },
      users: [from, to],
      sender: from,
      reciver:to,
     
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  }else{
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      reciver:to,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  }
  } catch (ex) {
    next(ex);
  }
};
async addmychat(req,res){
  try{
    const { from, to} = req.body;
    const check=await MyChat.findOne({  $or: [ { $and: [{sender: from}, {receiver: to}] },{$and: [ { $and: [{sender: to}, {receiver: from}] }]}]});
    console.log(check)
    if(!check){
      const savedata=await MyChat.create({sender:from,receiver:to});
      if (savedata) return res.json({ msg: "mychat added successfully." });
    }else{
      return res.json({ msg: "mychat added already." });
    }
  }catch(error){
    console.log(error)
  }
}
async fetchmychat(req,res){
  const userdata=[];
  const userdetails=[];
  const unseenmsg=[];
  try{
     const userid =req.params.id;
    const check=await MyChat.find({  $and: [ { $or: [{sender: userid}, {receiver: userid}] }]});
    if(!check){
      return res.json("No Chat avilable");
    }else{
      for await(const userdetail of check){
        if(userdetail.sender==userid){
        // const users=await MyChat.find({}).populate("receiver")
        userdata.push(userdetail.receiver);
        }else if(userdetail.receiver==userid){
          // const users=await MyChat.find({}).populate("sender")
          userdata.push(userdetail.sender);
        }
      }
     for await(const userchat of userdata){
     const userss=await User.findOne({_id:userchat});
     const finddata=await Messages.find({reciver:userid,sender:userchat,seen:false});
     const count=finddata.length
     unseenmsg.push(count)
     userdetails.push(userss)
     }
     return res.status(200).json({userdetails,unseenmsg});
    }
  }catch(error){
    console.log(error)
  }
}
async updatemessages(req,res){
  console.log(req.body)
  const id=req.params.id;
  const findchat=await Messages.findOne({sender:id}).sort({_id:-1})
  const chatid=findchat._id;
  const offline=req.body.offline;
  const online=req.body.online;
  const onchat=req.body.onchat;
  const chatdata={}
  if(offline=="true"){
    chatdata.useroffline=true;
  }
  if(online=="true"){
    chatdata.useronline=true;
  }
  if(onchat=="true"){
    chatdata.useronchat=true;
  }
  await Messages.findByIdAndUpdate(chatid,chatdata);
  return res.status(200).json('update successfully');
}
async chatnotification(req,res){
  const id=req.params.id
  try{
const finddata=await Messages.find({reciver:id,seen:false});
const count=finddata.length
return res.status(200).json(count)
  }catch(error){
    console.log(error)
  }
}
async updatechatnotification(req,res){
  const id=req.params.id
  const sender=req.body.sender
  try{
const finddata=await Messages.find({sender:sender,reciver:id,seen:false});
for(const data of finddata){
  const chatid=data._id;
  const chatdata={}
  chatdata.seen=true;
  await Messages.findByIdAndUpdate(chatid,chatdata)
}
return res.status(200).json("Update notification")
  }catch(error){
    console.log(error)
  }
}
async searchchatuser(req,res){
  const usename=req.params.id;
  try{
    const fetchuser = await User.find({ $and: [ { $or: [{
      fullname: { $regex: usename, $options: "i" }},{username: { $regex: usename, $options: "i" }}
    ] }]});
    if (fetchuser.length<1) {
      return res.status(400).json({ message: "No User found" });
    }
    return res.status(200).json(fetchuser);
  }catch(error){
    console.log(error)
  }
}
async fetchsearchchat(req,res){
  const userid=req.params.id;
  const userdata=[];
  try{
    const check=await MyChat.find({  $and: [ { $or: [{sender: userid}, {receiver: userid}] }]});
    if (check.length<1) {
      return res.status(400).json({ message: "No chat found" });
    }else{
      for await(const userdetail of check){
        if(userdetail.sender==userid){
        // const users=await MyChat.find({}).populate("receiver")
        const usersdata=await User.findOne({_id:userdetail.receiver})
        userdata.push(usersdata);

        }else if(userdetail.receiver==userid){
          // const users=await MyChat.find({}).populate("sender")
          const usersdata=await User.findOne({_id:userdetail.sender})
          userdata.push(usersdata);
        }
      }
    return res.status(200).json(userdata);
    }
  }catch(error){
    console.log(error)
  }
}
async allchatuser(req,res){
  try{
    const userdata=await User.find();
    return res.status(200).json(userdata);
  }catch(error){
    console.log(error);
  }
}
async addchatwelcome(req,res){
  try{
  const data={
    welcomemsg:req.body.welcomemsg,
    welcomeheading:req.body.welcomeheading
  }
  const welcome=new welcomechat(data);
  welcome.save().then((result)=>{
    return res.status(200).json('Save successfully')
  });
  }catch(error){
    console.log(error)
  }
}
async fetchwelcome(req,res){
  try{
  const data=await welcomechat.findOne({});
  return res.status(200).json(data)
  }catch(error){
    console.log(error)
  }
}
async updatewelcome(req,res){
  const id=req.params.id;
  try{
 const data={}
 data.welcomemsg=req.body.welcomemsg
 data.welcomeheading=req.body.welcomeheading
 await welcomechat.findByIdAndUpdate(id,data);
 return res.status(200).json("Update successfully")
  }catch(error){
    console.log(error)
  }
}
async testchat(req,res){
  const id =req.params.id;
  try{
    const check=await MyChat.find({  $or: [ { $or: [{sender: id}, {receiver: id}] }]});
    return res.status(200).json(check)
  }catch(error){
    console.log(error)
  }
}
}
module.exports = new Chat();


