const express = require('express');
const usersRouter = express.Router();
const userModel = require('./users.model');
const bcryptjs = require('bcryptjs');

const emailRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
// users/register
usersRouter.post('/register',async (req, res)=>{
    try {
        // get email,password 
        const email = req.body.email;
        const password = req.body.password;
        // validate email
        if(!emailRegex.test(email)){
            res.status(400).json({
                success: false,
                message: 'Invalid email adress',
            });
        }else if(!passwordRegex.test(password)){ // validate password
            res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }else{
            // check email exist
            const data = await userModel.findOne({email:email}).lean();// tra ve ban ghi goc
            if(data){
                res.status(400).json({
                    success: false,
                    message: 'Email has been used',
                });
            }else{
                // hash password
                const hashPassword = bcryptjs.hashSync(password,10);
                // create user records
                const newUser = await userModel.create({
                    email: email,
                    password: hashPassword,
                    fullName: req.body.fullName,
                });

                res.status(201).json({
                    success: true,
                    data: newUser,
                });
            }
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = usersRouter;