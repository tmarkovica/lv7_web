const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
         const result = await UserModel.findById(id)
         res.status(200).send(result)    
    } catch (err) {
         res.status(500).json({error: err.message})
    }
})

router.get('/register', (req, res) => {
    var name = req.body.naziv_projekta;
    var email = req.body.opis_projekta;
    var age = req.body.cijena_projekta;

    const user = new UserModel({
        name: name,
        email: email,
        age: age
    })

    user.save()
        .then(() => console.log('User saved to database...'))
        .catch(err => console.error('Error saving user...', err));

    res.redirect('/')
})


module.exports = router