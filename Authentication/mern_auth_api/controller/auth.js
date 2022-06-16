const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    createJWT,
} = require('../utils/auth');

exports.signup = async (req, res, next) => {
    let {name, email, password, password_confirmation} = req.body;
    
    try{
        const user = new User({
            name : name,
            email : email,
            password : password
        });

        bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt,async (err, hash)=>{
                    try{
                        user.password = hash;
                        const userSignup = await user.save();
                        res.status(200).json({
                        message : 'User created successfully',
                        user : userSignup
                        });   
                    }catch(err){
                        res.status(500).json({
                            message : 'email already exists',
                            error : err
                        });
                    }
                });
        });


    }catch(err){
        res.status(500).json({
            message : 'Error creating user + ' + err,
        });
    }
}

exports.signin = async(req, res,next) =>{
    let {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            res.status(404).json({
                message : 'User not found'
            });
        }else{
            bcrypt.compare(password, user.password, (err, result) => {
                if(!result){
                    res.status(401).json({
                        message : 'Invalid credentials'
                    });
                }else{
                    const access_token = createJWT(
                        user.email,
                        user._id,
                        3600
                    );
                    
                    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded)=>{
                        if(err){
                            res.status(500).json({
                                message : 'Error signing in' + err,
                            });
                        }
                        if(decoded){
                            res.status(200).json({
                                message : user.name + ' User signed in successfully',
                                token: access_token,
                            });
                        }
                    });

                }
            });
        }
        
    }catch(err){
        res.status(500).json({
            message : 'Error signing in' + err,
        });
    }

}