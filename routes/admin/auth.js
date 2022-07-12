import { Router } from "express";
// const userModel = require("../../database/models/user");
import { userModel } from "../../database/models/user.js";

const  router = Router();


router.route("/login").get((req, res) =>{
    res.render("admin/pages/login", {error: ""});
}).post((req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    userModel.findOne({
        username: username,
        password: password
    })
    .then((user) =>{
        console.log(user);
        req.session.isLoggedIn = true;
        req.session.username = user.username;
        req.session.userType = user.userType;
        res.redirect("/admin/product");
    })
    .catch(() =>{
        res.render("/admin/pages/login", {error: "some error in reading."})
    })
})



export {router as AdminauthRoute};