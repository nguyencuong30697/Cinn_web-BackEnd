const express = require('express');
const postsRouter = express.Router();
const postModel = require('./posts.model');
const joi = require('@hapi/joi');

postsRouter.get('/getListPosts/pagination', async (req,res)=>{
    const validateSchema = joi.object().keys({
        pageNumber: joi.number().min(1),
        pageSize: joi.number().min(1).max(10),
    });
    const pageNumber = Number(req.query.pageNumber); // number ma gui qua query la no se thanh string
    const pageSize = Number(req.query.pageSize);
    const validateResult = validateSchema.validate({pageNumber: pageNumber,pageSize: pageSize});
    if(validateResult.error){
        const error = validateResult.error.details[0];
        res.status(400).json({
            success: false,
            message: error.message,
        });
    } else{
        //get data
        // pagination
        // offset paging => pageNumber => limit|skip
        try{
            const result = await postModel.find({})
                                        .populate('author', '_id email fullName')
                                        .sort({createDate: -1}) // sort bai viet moi nhat -1 va 1
                                        .skip((pageNumber-1)*pageSize)
                                        .limit(pageSize)
                                        .lean();
            const total = await postModel.find({}).countDocuments(); // co bh ban ghi thoa man cai find

            res.status(200).json({
                success: true,
                data: {
                    data: result,
                    total: total,
                }
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
});

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