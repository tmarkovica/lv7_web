const express = require('express')
const db = require('./model/db') // calls file db.js in which is connect() function
const bodyParser = require('body-parser');
//const requireAuth = require('./middleware/authMiddleware')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const UserModel = require('./model/user')

const app = express()

app.use(cookieParser())

const requireAuth = (req, res, next) => {

    try {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, 'mysecret', async (err, decodedToken) => {
                if (err) {
                    res.redirect('/login')
                } else {

                    console.log(decodedToken._id)

                    const userInDb = await UserModel.findOne({_id: decodedToken._id})
                    if (userInDb)
                        next()
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

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/registration', (req, res) => {
    res.render('registration')
})

const userRouter = require('./routes/users')
const projectsRouter = require('./routes/projects')

app.use('/users', userRouter)
app.use('/projects', requireAuth, projectsRouter)

app.get('/readtoken', (req, res) => {
    const token = req.cookies.jwt
    console.log(token)
    res.redirect('/')
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})

