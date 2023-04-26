const jwt = require('jsonwebtoken')
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const requireAuth = (req, res, next) => {

    try {
        const token = req.cookies.jwt
        console.log(token)

        if (token) {
            jwt.verify(token, 'mysecret', (err, decodedToken) => {
                if (err) {
                    res.redirect('/login')
                } else {
                    console.log(decodedToken)
                    next()
                }
            })
        }
        else {
            res.redirect('/login')
        }

    } catch (err) {
        console.log(err)
    }   
}

module.exports = requireAuth