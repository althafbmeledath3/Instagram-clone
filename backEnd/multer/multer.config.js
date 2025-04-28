import multer from "multer";

const storage = multer.diskStorage({

    destination:(req,file,cb)=>cb(null,"images/"),

    filename:(req,file,cb)=>{

        cb(null,Date.now()+ "-" +file.originalname)
    }
})


const upload = multer({storage})

export default upload



// import multer from 'multer';

// const storage = multer.memoryStorage(); // Use memory storage for Cloudinary
// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed'), false);
//     }
//   },
// });

// export default upload;











