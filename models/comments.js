const { Schema, model } = require('mongoose')
const Comment = new Schema ({
    user: {type: Schema.Types.ObjectId, ref:"User", required: true},
    post: {type: Schema.Types.ObjectId, ref:"Post", required: true},
    commentContent: {type: String, required: true} ,
    date: {type: Date, required: true}
})
module.exports = model("Comments", Comment)