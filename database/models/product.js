import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true 
    },
    image:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ""
    }, 
    stock:{
        type: Number,
        required: true,
        default: 1
    },
    price:{
        type: Number,
        required: true,
        default: 100
    }
}, {
    timestamps: true
});

export const productModel = mongoose.model("product", productSchema);

