const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const user = require('../model/user')

router.get('/:id', async (req, res) => {
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
        name: req.body.name,
        password: req.body.password
    })

    if (login.name == '' || login.password == '')
        return

    try {
        const userInDb = await UserModel.findOne({email: newUser.email})

        if (userInDb) {
            
            if (login.password === userInDb.password) {
                res.render('/')
            }
        }
        else {
            res.send('Netočni podaci za prijavu')
        }
    } catch (err) {
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
        }
        else {
            res.send('E-Mail je zauzet')
        }
    } catch (err) {
        res.redirect('/')
    }   
})


module.exports = router