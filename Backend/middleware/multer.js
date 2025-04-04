import multer from 'multer';
import path from "path"


const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const fileFilter=(req,file,cb)=>{
    const allowTypes  =['image/jpeg', 'image/png', 'image/gif', 'image/jpg','image/webp']
    if (allowTypes.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new error ("File type is not supported"))
    }
}
 const uploads=multer({storage,fileFilter})


 export default uploads;