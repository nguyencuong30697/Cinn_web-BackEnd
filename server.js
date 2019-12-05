const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./users/users.routes');
// connect mongodb
mongoose.connect('mongodb://localhost:27017/cinn-Web',{useNewUrlParser: true},(error)=>{
    if (error){
        console.log(error);
        process.exit(); // ctrcl + C trong terminal
    }else{
        console.log("Connect to mongodb success ->");
        const server = express();

        //middleware 
        //bodyParser to read body in header of request
        server.use(bodyParser.json());

        //khai bao Routers
        server.use('/users',usersRouter);

        // start server port 3001
        server.listen(3001,(error) => {
            if(error){
                throw error;
            }else{
                console.log('Server listen on port 3001 ...');
            }
        }); // dua ra cai cong de no lang nghe event tu ben ngoai
    }
});

