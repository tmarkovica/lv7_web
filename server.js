const express = require('express')
const db = require('./model/db') // calls file db.js in which is connect() function
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

const requireAuth = require('./middleware/authMiddleware')

const app = express()

app.use(cookieParser())

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

app.get('/read', (req, res) => {
    res.send(req.cookies.user._id)
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})
