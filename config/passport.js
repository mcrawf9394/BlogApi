const User = require('../models/users')
const passport = require('passport')
const bcrypt = require('bcrypt')
require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const localStrategy = require('passport-local')
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET,
}
passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({id: jwt_payload.sub})
        .then(function (user) { 
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
    })
}))
passport.use('local', new localStrategy({username: 'username', password: 'password'}, (username, password, done) => {
    User.findOne({userName: username})
        .then ((user) => {
            if(!user) return done(null, false)
            const isValid = bcrypt.compareSync(password, user.password)
            if (isValid) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch((err) => {
            done(err)
        })
}))