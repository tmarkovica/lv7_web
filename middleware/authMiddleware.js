const jwt = require('jsonwebtoken')
const UserModel = require('../model/user')

/* const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser()); */

const requireAuth = (req, res, next) => {

    try {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, 'mysecret', async (err, decodedToken) => {
                if (err) {
                    res.redirect('/login')
                } else {
                    const userInDb = await UserModel.findOne({_id: decodedToken._id})
                    if (userInDb) {
                        next()
                    }                        
                    else
                        res.redirect('/login')
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