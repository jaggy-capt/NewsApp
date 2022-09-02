const express=require('express');
const app=express();
const PORT=3000;
const mustacheExpress=require("mustache-express");
const bodyParser=require("body-parser");
const pgp=require("pg-promise")()
const CONNECTION_STR="postgres://localhost:5432/newsdb"
const bcrypt=require("bcrypt");

const session = require("express-session");
const path=require("path");
const VIEW_PATH=path.join(__dirname,"/views");
const userRoute=require("./routes/user");
const indexRoute=require("./routes/index");
const checkAuthorization=require("./utlis/authorization");

app.use("/css",express.static('css'));

app.engine('mustache',mustacheExpress(VIEW_PATH+"/partials",".mustache"));
app.set('views','./views')
app.set("view engine","mustache");
app.use(bodyParser.urlencoded({extended:false}));



app.use(session({

    secret:"sdfadsafsad",
    resave:false,
    saveUninitialized:false

}));

app.use((req,res,next)=>{
    res.locals.authenticated=req.session.user==null?false:true;
    next();
});

app.use("/user",checkAuthorization,userRoute);
app.use(indexRoute);

db=pgp(CONNECTION_STR);




app.listen(PORT,()=>{
    console.log('Server is running on ${PORT}')
})
