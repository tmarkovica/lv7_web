const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/one/:id', async (req, res) => {
    try {
        const id = req.params.id
         const result = await UserModel.findById(id)
         res.status(200).send(result)    
    } catch (err) {
         res.status(500).json({error: err.message})
    }
})

router.post('/login', async (req, res) => {
    const login = new UserModel({
        email: req.body.email,
        password: req.body.password
    })

    if (login.name == '' || login.password == '')
        return

    try {
        const userInDb = await UserModel.findOne({email: login.email})

        if (userInDb) {

            console.log("user found in db")
            
            if (login.password === userInDb.password) {
                console.log("password matches")
                res.cookie("user", userInDb)
                const token = jwt.sign(userInDb.toJSON(), 'mysecret')
                res.cookie("jwt", token)
                res.redirect('/')
            } else {
                res.send('Netočni podaci za prijavu')    
            }
        }
        else {
            res.send('Netočni podaci za prijavu')
        }
    } catch (err) {
        console.log(err.message)
        res.redirect('/')
    } 
})

router.post('/register', async (req, res) => {
    const newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    if (newUser.name == '' || newUser.password == '' || newUser.email == '')
        return

    try {
        const userInDb = await UserModel.findOne({email: newUser.email})

        if (userInDb == null) { // ako user već ne postoji onda je tek moguće kreirati novog
            
            newUser.save()
                .then(() => console.log('User saved to database...'))
                .catch(err => console.error('Error saving user...', err));

            res.redirect('/')
        }
        else {
            res.send('E-Mail je zauzet')
        }
    } catch (err) {
        res.redirect('/')
    }   
})

module.exports = router