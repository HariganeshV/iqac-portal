const multer = require("multer");

const storage =
multer.diskStorage({

destination:(req,file,cb)=>{

let folder="uploads/faculty";

if(

req.originalUrl.includes("/hod")

){

folder="uploads/hod";

}

cb(null,folder);

},

filename:(req,file,cb)=>{

cb(

null,

Date.now()+"_"+file.originalname

);

}

});

module.exports=

multer({

storage

});