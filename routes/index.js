const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const SALT_ROUNDS=10;

router.get("/", async (req,res)=>{

    /*db.any("SELECT articleid,title,body FROM article")
    .then((article)=>{
        res.render("index",{article:article});
    })*/

   let article= await db.any("SELECT articleid,title,body FROM article");    
    res.render("index",{article:article});
  

});



router.post("/login",(req,res)=>{

        let username=req.body.username;
        let password=req.body.password;
        
        db.oneOrNone("SELECT userid,username,password from users where username=$1",[username])
        .then((user)=>{
            if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){

                    if(req.session){
                        req.session.user={username:username,userid:user.userid}; 
                        res.redirect("/user/article");
                    }

                    
                }else{
                    res.render("login",{message:"Invalid username or passowrd"});
                }
            })
        }else{
            res.render("login",{message:"Invalid username or passowrd"});
        }
        })

})

router.get("/logout",(req,res,next)=>{

    if(req.session){
        req.session.destroy((error)=>{
            if(error){
            next(error);
            }else{
                res.redirect("/login");
            }
        })
    }

})

router.get("/login",(req,res)=>{


    res.render("login");

});

router.post("/Register",(req,res)=>{

    let username=req.body.username;
    let password=req.body.password;

    /*db.any("SELECT userid FROM users")
    .then((user)=>{
        console.log(user);
    }).catch(error=>console.log(error));*/

    db.oneOrNone("select userid from users where username=$1",[username])
    .then((user)=>{

        if(user){
            res.render("register",{message:"This user is already exit!"});
        }else{

            bcrypt.hash(password,SALT_ROUNDS,(error,hash)=>{


                if(error==null){
                    db.none("INSERT INTO users(username,password)VALUES($1,$2)",[username,hash])
                    .then(()=>{
                        res.render("login");
                    });
                    
                }
            })

          
        }

    })

   



})


router.get("/Register",(req,res) => {

    res.render("register");

})


module.exports=router;