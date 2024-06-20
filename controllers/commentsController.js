const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comments')
exports.getAllComments = asyncHandler(async (req, res, next) => {
    try {
        const comments = await Comment.find().sort({date: 1}).exec()
        res.json(comments)
    } catch (err) {
        res.json(err)
    }
})
exports.createComment = [
    body('user', 'Must Include User')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('post', 'Must include Post')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('commentContent', 'Must include Comment Content')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('date', 'Must include Date')
        .trim()
        .isLength({min: 1})
        .escape(),
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({
                error: errors.array()
            })
        } else {
            try {
                const newComment = new Comment ({
                    user: req.body.user,
                    post: req.body.post,
                    commentContent: req.body.commentContent,
                    date: req.body.date
                })
                await newComment.save()
                res.json({success: newComment})
            } catch (err) {
                res.json({error: err})
            }
        }
    })
]
exports.updateComment = [
    body('commentContent', 'Must include Comment Content')
        .trim()
        .isLength({min: 1})
        .escape(),
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({error: errors.array()})
        } else {
                try {
                    let token = req.headers.authorization.split(' ')[1]
                    const user = jwt.decode(token)
                    const comment = await Comment.findById(req.params.commentId)
                    if (comment.user != user.id) {
                        res.json({error: [{"msg": "You can only update comments that you posted"}]})
                    } else {
                        await Comment.findOneAndUpdate({_id: req.params.commentId}, {commentContent: req.body.commentContent}, {})
                        res.json({success: "comment updated successfully"})
                    }
                } catch (err) {
                    res.json({error: [{"msg": err}]})
                }
            }
        }
    )
]
exports.deleteComment = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            let token = req.headers.authorization.split(' ')[1]
            const user = jwt.decode(token)
            const comment = await Comment.findById(req.params.commentId)
            if (comment.user != user.id) {
                res.json({error: [{"msg": "You can only delete comments that you posted"}]})
            } else {
                await Comment.findOneAndDelete({_id: req.params.commentId})
                res.json({success: "comment deleted successfully"})
            }
        } catch (err) {
            res.json({error: [{"msg": err}]})
        }
    })
]