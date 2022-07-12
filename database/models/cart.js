import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    product_name:{
        type: String,
        required: true 
    },
    product_id:{
       type: String,
       required: true
    },
    product_image:{
    type: String,
    required: true
    },
    product_discription:{
        type: String,
        default: ""
    },
    user_id:{
        type: String,
        required: true
    }, 
    product_quantity:{
        type: Number,
        required: true,
        default: 1
    },
    product_price:{
        type: Number,
        required: true,
        default: 100
    }
}, {
    timestamps: true
});

export const cartModel = mongoose.model("cart", cartSchema);

