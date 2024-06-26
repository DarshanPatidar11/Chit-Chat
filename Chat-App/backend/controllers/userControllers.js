const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
const generateToken = require('../config/generateToken.js');

// @route POST /api/user/
const registerUser = asyncHandler(async(req,res)=>{
    const { userName, email, password, pic } = req.body;

    if(!userName || !email || !password){
        res.status(400);
        throw new Error('Please Enter all the fields');
    }

    const userExists = await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        userName,
        email,
        password,
        pic
    });
    
    if(user){
        res.status(201).json({
            _id : user._id,
            userName : user.userName,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error('Failed to register');
    }
});

// @route POST /api/user/login
const authUser = asyncHandler( async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            userName : user.userName,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// @route GET /api/user?search=darshan
const allUsers = asyncHandler( async (req,res) => {
    const keyword = req.query.search ? {
        $or: [
            { userName : { $regex : req.query.search, $options : 'i' } },
            { email : { $regex : req.query.search, $options : 'i' } },
        ],
    } : {};

    const users = await User.find(keyword).find({_id:{$ne: req.user._id}});
    res.send(users);
});

module.exports = { registerUser , authUser , allUsers };