const {Schema, model} = require('mongoose')
const Post = new Schema ({
    author: {type: Schema.Types.ObjectId, ref:"User", required: true},
    title: {type: String, required: true},
    postContent: {type: String, required: true},
    comments: {type: Array, ref:"Comments", required: true}
})
module.exports = model("Posts", Post)