const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./users/users.routes');
const expressSession = require('express-session');
var cors = require('cors')
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
        server.use(express.static('public'));
        // Cho phep ten mien dc truy cap vao origin
        server.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
        }));

        server.use(bodyParser.json());
        server.use(expressSession({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
          }));

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

