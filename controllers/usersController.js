const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const Users = await User.find().sort({_id: 1}).exec()
    if (Users.length > 0) {
        res.json(Users)
    } else {
        res.json({error: "There are no users"})
    }
})
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const singleUser = await User.findById(req.params.userId).exec()
    if (!singleUser) {
        res.json({error: "This user does not exist"})
    } else {
        res.json(singleUser)
    }
})
exports.createUser = [
    body("firstName", "Must include first name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("lastName", "Must include last name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("username", "Must enter username")
        .trim()
        .isLength({min: 1})
        .custom(async value => {
            const user = await User.findOne({userName: value})
            if (user) {
                throw new Error ("This user already exists!")
            }
        })
        .escape(),
    body("password", "Must enter password")
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.json({error: errors.array()})
        } else {
            let salt = bcrypt.genSaltSync(10)
            let hashedPassword = bcrypt.hashSync(req.body.password, salt)
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName, 
                userName: req.body.username,
                password: hashedPassword,
                isCreator: false
            })
            await newUser.save()
            res.json({success: "User has been added"})
        }
    })
]
exports.loginUser = [
    body('username')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('password')
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({error: errors.array()})
        } else {
            const user = await User.findOne({userName: req.body.username}).exec()
            if (!user) {
                res.json({error: "This user does not exist"})
            } else {
                let isValid = bcrypt.compareSync(req.body.password, user.password)
                if (!isValid) {
                    res.json({error: "This password is incorrect"})
                } else {
                    let token = jwt.sign({id: user._id}, process.env.ACCESS_SECRET, {expiresIn: '1h'})
                    res.json({token})
                }
            }
        }
    })
]
exports.updateUser = [
    body("username", "Must enter a username")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("password", "Must enter a password")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("firstName", "Must have a first name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("lastName", "Must have a last name")
        .trim()
        .isLength({min: 1})
        .escape(),
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({error: errors.array()})
        } else {
            let token = req.headers.authorization.split(' ')[1]
            let currentUser = jwt.decode(token)
            if (currentUser.id != req.params.userId) {
                 res.json({error: "Can not edit a different user"})
            }
            let salt = bcrypt.genSaltSync(10)
            let hashedPassword = bcrypt.hashSync(req.body.password, salt)
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName, 
                userName: req.body.username,
                password: hashedPassword,
                isCreator: false,
                _id: req.params.userId
            }) 
            await User.findOneAndUpdate({_id: req.params.userId}, newUser, {}).exec()
            res.json({newUser})
        }
    })
]
exports.deleteUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        let token = req.headers.authorization.split(' ')[1]
        let currentUser = jwt.decode(token)
        if (currentUser.id != req.params.userId) {
             res.json({error: "Can not edit a different user"})
        }
        await User.findByIdAndDelete(req.params.userId)
        res.json({message: "success"})
    })
]