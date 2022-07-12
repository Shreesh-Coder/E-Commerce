import express from "express";
import {init} from "./database/index.js";
import { upload } from "./utils/uploads.js";
import { userModel, userRolesEunms } from "./database/models/user.js";
import session from "express-session";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sendMail from "./utils/sendMail.js";
import { cartModel } from "./database/models/cart.js";

import { AdminauthRoute } from "./routes/admin/auth.js";
import { AdminproductRoute } from "./routes/admin/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000

app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: "hello world",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static("uploads"));
app.use(express.static("scripts"));
app.use("/admin/product", (req, res, next) =>{
    //need some validation of admin.

    if(req.session.isLoggedIn)
    {
        console.log(req.session)
        if(req.session.userType === userRolesEunms.admin)
        {
            next();
        }
        else
        {
            res.end("Your are not authreized.");
        }
    }
    else
    {            
        res.redirect("/admin/auth/login");
    }
    
})
app.use("/admin/auth", AdminauthRoute);
app.use("/admin/product", AdminproductRoute);



//Initate database connection
init();

app.get("/auth", (req, res) =>{
    res.render("auth");    
})

app.route("/login").get( (req, res) =>{
    res.render("login",{error: ""});    
}).post((req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password, 49);
    userModel.findOne({username: username, password: password})
    .then((user) =>{
        console.log(user);
        if(!user.isVerifiedMail)
        {
            res.render("login",{error: "please verify the mail first"});    
            return;
        }
        req.session.isLoggedIn = true;
        req.session.username= user.username;
        req.session.profile_pic = user.profile_pic;
        req.session.user_id = user._id;
        req.session.userType = user.userType;
        res.redirect("/");
    })
    .catch((err)=>{
        console.log(err);
        res.render("login", {error: "Some error"})
    })
})


app.route("/signup").get((req, res) =>{
    res.render("signup", {error: ""});    
}).post(upload.single("profile_pic"), (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const file = req.file;

    if(!username)
    {
        res.render("signup", {error: "Please Enter username"});
        return;
    }

    if(!password)
    {
        res.render("signup", {error: "Please Enter password"});
        return;
    }

    if(!file)
    {
        res.render("signup", {error: "Please Choose the file"});
        return;
    }
    
    userModel.create({
        username: username,
        password: password,
        profile_pic: file.filename,
        isVerifiedMail: false,
        userType: userRolesEunms.customer
    }).then(() =>{
        let html = ` <h1>click here to verify</h1> <a href="http://localhost:3000/verfiyUser/${username}">Click Me</a>`;
        
        console.log("hello");
        sendMail(
            username,
            "Welcome to Ecomm",
            "Pleace click here to verify", 
            html,
            (err) =>{
                if(err)
                {
                    res.render("signup", {error: "unable to send email"});
                }else
                {
                    res.redirect("/login");       
                }
            }
        )        
    }).catch(() =>{
        res.render("signup", {error: "something went terribly wrong"});
    })
})


app.get("/", (req, res) =>{

        const username = req.session.username;
        const profile_pic = req.session.profile_pic;

        readProducts((err, products) =>{
            if(err){
                res.end("error in reading products.");
            }
            else
            {
               renderIndex(req, res, username, profile_pic, products, "");
            }
        })   
})

app.route("/logout").get((req, res) =>{
    req.session.destroy();
    res.redirect("/");
})


app.post("/product-discription", (req, res)=>{

    readProducts((err, products) =>{
        if(err)
        {
            res.end("error in reading file.");
        }
        else
        {
            console.log(req.body);
            let product = products.filter((product) =>{
                console.log(product.name);
                return product.name === req.body.productName;
            })
            console.log(product);
            console.log(product[0].discription);
            res.end(product[0].discription);
        }
    })
})

app.post("/load-more", (req, res) =>{
    const length = req.body.length;

    readProducts((err, products) =>{
        if(err)
        {
            res.end("error in reading file.");
        }
        else
        {
            console.log(length);
            const next5Len = length + 5;
            
            if( next5Len > products.length)
            {
                let temp = [];

                for(let i = length; i < products.length; i++)
                {
                    temp.push(products[i]);
                }

                res.send(temp);
            }
            else
            {
                let temp = [];

                for(let i = length; i < next5Len; i++)
                {
                    temp.push(products[i]);
                }

                res.send(temp);
            }
        }
    })
})


app.get("/verfiyUser/:username", (req, res) =>{
    const username = req.params.username;

    userModel.findOne({username: username})
    .then(user =>{
        if(user)
        {
            userModel.updateOne({username: username},{$set: {isVerifiedMail: true}})
            .then(()=>{
                console.log("updation is succesful");                
            })
            .catch(() =>{
                console.log("error occured while updation.");
            })
            res.redirect("/login");
        }
        else
        {
            res.send("some error in verification.")
        }
    })
})

app.route("/forget-password").get((req, res) =>{
    res.render("forget-password", {error: ""});
}).post((req, res)=>{
    const username = req.body.username;

    let html = `<h1>Click here to reset password</h1> <a href="http://localhost:3000/reset-password/${username}">Click here</a>`;

    sendMail(username,
        "Reset Password", 
        "",
        html,
        (err) =>{
            if(err)
                res.render("forget-password", {error: "unable to send email"});
            else
            {                
                res.send("check your mail");
            }
        }
    )
})

app.route("/reset-password/:username").get((req, res) =>{
    const username = req.params.username;
    res.render("reset-password", {username : username, error: ""});    
}).post((req, res) =>{
    const username = req.params.username;
    const password = req.body.password;
    userModel.updateOne({username: username}, { $set: {password: password}})
    .then((user) =>{
        if(req.session.isLoggedIn)
            res.redirect("/auth");
        else
            res.redirect("/login");

    }).catch(() =>{
        res.render("reset-password", {username : username, error: "error updating password"});           
    })
})

app.route("/cart").post((req, res) =>{
    console.log(req.body);


    if(!req.session.isLoggedIn)
    {
        res.status(401).json({status: false, message: "plase login", data: null});
        return;
    }
    
    let product_id = req.body.id;
    let user_id = req.session.user_id;
    

    cartModel.findOne({product_id: product_id, user_id: user_id})
    .then(product =>{
        if(product)
        {
            console.log("product is already in your cart.");
            res.status(200).json({status: true, message: "product is already in your cart", data: null});
        }
        else
        {

            readProducts((err, products) =>{
                if(err)
                {
                    res.end("error in reading products");
                }
                else
                {
                    
                    let product = products.filter(product =>{
                        return product._id === product_id;
                    });

                    cartModel.create(
                    {
                        product_name: product[0].name,
                        product_id: product_id,
                        product_image: "random",
                        product_discription:"abced",
                        user_id: user_id                    
                    }
                    ).then(() =>{
                        res.status(200).json({status: true, message: "product is added to the cart", data: null});
                    })
                }
            })
            
        }                    
    })    
})

app.route("/view-cart").get((req, res) =>{
    if(req.session.isLoggedIn)
    {
        const username = req.session.username;
        const profile_pic = req.session.profile_pic;

        let user = {username: username, profile_pic: profile_pic};
        
        cartModel.find({user_id: req.session.user_id})
        .then((products) =>{
            console.log(products, 335);
            if(products)
                res.render("view-cart", {user: user, products: products, message: ""});
            else
                res.render("view-cart",{user: user, products: [], message:"Your Cart is Empty"})
        })
        .catch(() =>{
            console.log("error in finding products.");
        })
        

        
    }else
    {        
        readProducts((err, products) =>{
            if(err){
                res.end("error in reading products.");
            }
            else
            {
               renderIndex(req, res, null, null, products ,"Please login", 401);
            }
        }) 
        
    }
}).post((req, res) =>{

})

app.post("/delete-product", (req, res) =>{    
    if(req.session.isLoggedIn)
    {

        console.log(req.body);
        let product_id = req.body.product_id;
        let user_id = req.session.user_id;

        cartModel.deleteOne({user_id: user_id, product_id: product_id})
        .then(() =>{
            res.end("product is removed from cart.");
        })
        .catch(() =>{
            res.status(404).end("product is not removed form the cart.");
        })
    }
})


app.post("/quantity-inc", (req, res) =>{
    changeQuantity(req, res, true);
})

app.post("/quantity-dec", (req, res) =>{
    changeQuantity(req, res, false);
})

function changeQuantity(req, res, isInc)
{
    if(req.session.isLoggedIn)
    {
        let product_id = req.body.product_id;            
        let user_id = req.session.user_id;  

        
        let obj = isInc ? {$inc : {product_quantity: 1 }} : {$inc : {product_quantity: -1 }}
        cartModel.findOneAndUpdate({user_id: user_id, product_id: product_id}, obj, {new: true})
        .then((product) =>{            
            res.end(JSON.stringify(product.product_quantity));
        })
        .catch(() =>{
            res.status(404).end("error in updating the value");
        })
    }

}




function renderIndex(req, res, username, profile_pic, products ,error, status=200){
    let first5Products = [];
    if(products.length > 5)
    {
        for(let i = 0; i < 5; i++)
        {
            first5Products.push(products[i]);
        }
    }
    else{                    
        first5Products = products;
    }


    let user = null;
    if(req.session.isLoggedIn)
    {
        user = {username : username, profile_pic: profile_pic}
        
    }

    res.status(status).render("index",
    {
        user: user,
        products: first5Products,
        error: error
    });
}

function readProducts(cb){
    fs.readFile("products.json", "utf-8", (err, data)=>{
        if(err)
        {
            console.log(err);
            cb(err, null);
        }
        else
        {
            let products = [];
            if(data != undefined)
                products = JSON.parse(data);
        
            
            cb(null, products);
            
        }
    })
}

app.listen(port, () =>{
    console.log(`Server is listening at ${port}`);
})