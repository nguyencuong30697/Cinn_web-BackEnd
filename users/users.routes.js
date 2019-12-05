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

usersRouter.post('/login',async (req,res)=>{
    // check email
    const email = req.body.email;
    const password = req.body.password;
    try {
        // check email used or not ?
        const user = await userModel.findOne({email: email}).lean();
        if (!user) {
          res.status(404).json({
            success: false,
            message: 'User not found'
          });
        } else if (!bcryptjs.compareSync(password, user.password)) {
          res.status(400).json({
            success: false,
            message: 'Wrong password'
          });
        } else {
          // Session nay bên front chỉ lấy cái currentuser để check hoặc gắn vào localstorage
          req.session.currentUser = {
            _id: user._id,
            email: user.email
          };
    
          res.status(200).json({
            success: true,
            message: 'Login success',
            data: {
              email: user.email,
            },
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    // check password
});

// logout user => delete session
usersRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({
      success: true,
      message: 'Log out success',
    });
  });
  
// test Session
usersRouter.get('/test', (req, res) => {
    console.log(req.session.currentUser);
    res.json({
      success: true,
    });
  });

module.exports = usersRouter;