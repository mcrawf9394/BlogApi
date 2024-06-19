const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    try { 
        const posts = await Post.find().sort({date: 1}).exec()
        res.json({posts: posts})
    } catch (err) {
        res.json({error: err})
    }
})
exports.createPost = [
    body('title', 'Must include a title')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('postContent', 'Must include post content')
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
            const user = jwt.decode(token)
            const dbUser = await User.findById(user.id).exec()
            if (dbUser.isCreator === false) {
                res.json({error: [{"msg": "Only the creator of this project can add posts"}]})
            } else {
                const newPost = new Post({
                    author: user.id,
                    title: req.body.title,
                    postContent: req.body.postContent,
                    comments: [],
                    date: new Date()
                })
                await newPost.save()
                res.json({success: "Post has been added successfully"})
            }
        }
    })
]
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).exec()
        if (post.comments.length === 0) {
            res.json({post: post, comments: ["There are no comments"]})
        } else {
            const comments = await Comment.find({post: post._id}).sort({date: 1}).exec()
            res.json({post: post, comments: comments})
        }
    } catch (err) {
        res.json({error: err})
    }
})
exports.updatePost = [
    body("title", "must include title")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("postContent", "Must include post content")
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
            const user = jwt.decode(token)
            const dbUser = await User.findById(user.id).exec()
            if (dbUser.isCreator === false) {
                    res.json({error: [{"msg": "Only the creator of this project can add posts"}]})
            } else {
                await Post.findOneAndUpdate({_id: req.params.postId}, {title: req.body.title, postContent: req.body.postContent}, {})
                res.json({success: "Post update successful"})
            }
        }
    })
]
exports.deletePost = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        let token = req.headers.authorization.split(' ')[1]
        const user = jwt.decode(token)
        const dbUser = await User.findById(user.id).exec()
        if (dbUser.isCreator === false) {
            res.json({error: [{"msg": "Only the creator of this project can add posts"}]})
        } else {
            const currentPost = await Post.findById(req.params.postId)
            if (currentPost.comments.length != 0) {
                await Comment.deleteMany({post: req.params.postId})
            }
            await Post.findByIdAndDelete(req.params.postId)
            res.json({success: "This post has been deleted successfully"})
        }
    })
]