const express = require("express");
const router=express.Router();


router.post("/add-article",(req,res)=>{

    let title=req.body.title;
    let description=req.body.description;
    let userid=req.session.user.userid;

    db.none("INSERT INTO article(title,body,userid)VALUES($1,$2,$3)",[title,description,userid])
    .then(()=>{
        res.redirect("/user/article");
    })

});


router.get("/add-article",(req,res)=>{

        res.render("add-article");

})

router.post("/delete-article",(req,res)=>{

    let articleid=req.body.articleid;

    db.none("DELETE FROM article where articleid=$1",[articleid])
    .then(()=>{
        res.redirect("/user/article");
    })

});


router.get("/article/edit/:articleid",(req,res)=>{

        let articleid=req.params.articleid;

        db.one("SELECT articleid,title,body FROM article where articleid=$1",[articleid])
        .then((article)=>{
            res.render("edit-article",article);
        })


})

router.post("/update-article",(req,res)=>{

        let articleid=req.body.articleid;
        let title=req.body.title;
        let body=req.body.description;

        db.none("UPDATE article SET title=$1,body=$2 where articleid=$3",[title,body,articleid])
        .then(()=>{
            res.redirect("/user/article"); 
        })


})




router.get("/article",(req,res)=>{


        let userid=req.session.user.userid;

        db.any("SELECT articleid,title,body FROM article where userid=$1",[userid])
        .then((article)=>{
            res.render("article",{article:article})
        })

       

})


module.exports=router;