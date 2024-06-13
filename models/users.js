const { Schema, model } = require('mongoose')
const User = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type:String, required: true},
    userName: {type:String, required: true},
    password: {type:String, required: true},
    isCreator: {type: Boolean, required: true}
})
module.exports = model('User', User)