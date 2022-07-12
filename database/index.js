import mongoose from "mongoose"

export const init = () => {
    mongoose.connect("mongodb+srv://root:94255@cluster0.gecbj.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() =>{
        console.log("db is live");
    })
    .catch(() =>{
        console.log("error in db connection");
    })
}