const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const AppError = require('../utils/appError');


const createToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 1) check if email and password exist
        if (!email || !password) {
            return next(new AppError(process.env.HTTP_BAD_REQUEST_STATUS_CODE, process.env.ERROR_STATUS, 'Please provide email and password'), req, res, next);
        }

        // 2) check if user exist and password is correct
        const user = await User.findOne({
            email
        }).select('+password').populate("role");
        if (!user || !await user.correctPassword(password, user.password)) {
            return next(new AppError(process.env.HTTP_UNAUTHORIZED_STATUS_CODE, process.env.ERROR_STATUS, 'Email or Password is wrong'), req, res, next);
        }

        // 3) All correct, send jwt to client
        const token = createToken(user.id);

        // Remove the password from the output 
        user.password = undefined;

        res.status(process.env.HTTP_OK_STATUS_CODE).json({
            message: "Login process was successful.",
            status: process.env.SUCCESS_STATUS,
            token,
            token_type: process.env.AUTHORIZATION_TYPE,
            data: {
                user
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        
        const { firstName, lastName, email, password, passwordConfirm, role } = req.body

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            passwordConfirm,
            role
        });

        const user = await User.findOne({
            email
        }).select('+password').populate("role");
        const token = createToken(user.id);

        user.password = undefined;

        res.status(process.env.HTTP_CREATED_STATUS_CODE).json({
            message: "User signup process was successful.",
            status: process.env.SUCCESS_STATUS,
            token,
            token_type: process.env.AUTHORIZATION_TYPE,
            data: {
                user
            }
        });

    } catch (err) {
        next(err);
    }

};

exports.protect = async (req, res, next) => {
    try {
        // 1) check if the token is there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith(process.env.AUTHORIZATION_TYPE)) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(process.env.HTTP_UNAUTHORIZED_STATUS_CODE, process.env.ERROR_STATUS, 'You are not logged in! Please login in to continue.'), req, res, next);
        }


        // 2) Verify token 
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) check if the user is exist (not deleted)
        const user = await User.findById(decode.id).populate("role");
        if (!user) {
            return next(new AppError(process.env.HTTP_UNAUTHORIZED_STATUS_CODE, process.env.ERROR_STATUS, 'This user is no longer exist'), req, res, next);
        }

        req.user = user;
        next();

    } catch (err) {
        next(err);
    }
};

// Authorization check if the user have rights to do this action
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.name)) {
            return next(new AppError(process.env.HTTP_FORBIDDEN_STATUS_CODE, process.env.ERROR_STATUS, 'You are not allowed to do this action'), req, res, next);
        }
        next();
    };
};