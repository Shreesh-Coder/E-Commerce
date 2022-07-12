import { Router } from "express";
import { productModel } from "../../database/models/product.js";
import { upload } from "../../utils/uploads.js";
const  router = Router();


router.route("/").get((req, res) =>{
    res.render("admin/pages/add_product");
}).post(upload.single("product_image") ,(req, res) =>{
    const product_name = req.body.product_name;
    const product_des = req.body.product_des;
    const product_price = req.body.product_price;
    const product_quantity = req.body.product_quantity;
    
    const product_image = req.file.filename;

    productModel.create({
        title: product_name,
        description: product_des,
        stock: product_quantity,
        price: product_price,
        image: product_image
    })
    .then(() =>{
        res.render("admin/pages/add_product", {data: null, message: "Added Successfully", error: ""});
    })
    .catch(() =>{
        res.render("admin/pages/add_product", {data: null, message: "", error: "Something went wrong"});
    })
})


router.post("/product-update", (req, res) =>{
    let id = req.body.product_id;
    let name = req.body.name;
    let price = req.body.price;
    let description = req.body.description;
    let quantity = req.body.quantity;

    productModel.updateOne({_id : id}, {$set:{
        title: name,
        price: price,
        description: description,
        stock: quantity
    }})
    .then(() =>{
        res.end("update is succesfull");
    })
    .catch(() =>{
        res.end("error on updation.");
    })
})

router.post("/product-delete", (req, res) =>{
    let id = req.body.product_id;

    productModel.deleteOne({_id: id})
    .then(() =>{
        res.end("delete succesfull");
    })
    .catch(() =>{
        res.status(404).end("error on deletion.");
    })
})

router.get("/product-view", (req, res) =>{

    productModel.find({})
    .then((products) =>{
        res.send(products);
    })
    .catch(() =>{
        res.status(404).end("some error.");
    })
})


export {router as AdminproductRoute};