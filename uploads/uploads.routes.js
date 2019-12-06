const express = require('express');
const multer = require('multer');
const fs = require('fs');

const uploadsRouter = express.Router();

const upload = multer({
    dest: 'public/',
});

// chi dc upload 1 file . va la ten cua file trong req.body
uploadsRouter.post('/photos',upload.single('image'),async (req, res)=>{
        console.log(req.file); // dua thong tin cua file vao request.file
        //rename
        //Lay ra duoi file . ext la duoi file
        const fileExt = req.file.originalname.split('.');
        const ext = fileExt[fileExt.length - 1];
        // dung fs doi ten file de co the xem dc file 
        fs.renameSync(req.file.path,`public/${req.file.filename}.${ext}`);
        //return Url
        res.status(200).json({
            success: true,
            data: `/${req.file.filename}.${ext}`,
        });
});

module.exports = uploadsRouter;
