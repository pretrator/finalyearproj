const app=require('express')()
const bodyParser=require("body-parser")
const dotenv=require('dotenv').config()
const multer=require('multer')
const {spawn} = require('child_process');
const fs = require('fs');
app.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});

const upload = multer({storage:storage})



app.post("/",upload.single("image"),(req,res)=>{
 let dataToSend="";
 const python = spawn('python', ['detecor.py',"--image",req.file.filename]);
//  python.stdin.write(req.body.data)
//  python.stdin.end()

 python.stdout.on('data', function (data) {
  dataToSend = data.toString();
 });
 python.on('close', (code) => {
  res.sendFile("out-"+req.file.path,{root:__dirname})
  const f1=req.file.path
  const f2="out-"+f1
  fs.access(f1, error => {
    if (!error) {
        fs.unlink(f1,function(error){});
    } else {
        console.log(error);
    }
});
fs.access(f2, error => {
  if (!error) {
      fs.unlink(f2,function(error){});
  } else {
      console.log(error);
  }
});
 });
 python.stderr.on("data",(err)=>console.log(err.toString()))
})

app.listen(process.env.PORT,()=>console.log("App running"))
