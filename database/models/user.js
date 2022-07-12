import mongoose from "mongoose";

export const userRolesEunms = {
    admin: 1,
    customer: 2
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic:{
        type: String,
        required: true 
    }, 
    isVerifiedMail:{
        type: Boolean,
        required: true
    },
    userType:{
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const userModel = mongoose.model("user", userSchema);

