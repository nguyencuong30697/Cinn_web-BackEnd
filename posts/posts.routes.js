const express = require('express');
const postsRouter = express.Router();
const postModel = require('./posts.model');
const joi = require('@hapi/joi');

postsRouter.post('/create-post',async (req,res)=>{
    //check login
    if(!req.session.currentUser || !req.session.currentUser.email ){
        res.status(403).json({
            success: false,
            messagge: 'Forbidder',
        });
    }else{
        //validate
        const postValidateSchema = joi.object().keys({
            imgUrl: joi.string().required(),
            content: joi.string().required(),
        });
        const validateResult = postValidateSchema.validate({imgUrl: req.body.imgUrl,content: req.body.content});

        // send response if error of validate
        if(validateResult.error){
            const error = validateResult.error.details[0];
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }else{
            try{
                //create new post
                const newPost = await postModel.create({
                    imgUrl: req.body.imgUrl,
                    content: req.body.content,
                    author: req.session.currentUser._id,
                });
                res.status(200).json({
                    success: true,
                    data: newPost,
                });
            }catch(error){
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }
});

postsRouter.get('/:postId',async (req,res)=>{
    //checkLogin cung duoc
    try{
        const post = await postModel.findById(req.params.postId)
                                            .populate('author', '_id email fullName').lean(); 
        // populate nhhu join thi response tra ve co ca thong tin ngg dung
        // neu populate coi bang nua thi lai .populate
        res.status(200).json({
            success:true,
            data: post,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = postsRouter;