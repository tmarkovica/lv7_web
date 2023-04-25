const express = require('express')
const db = require('./model/db') // calls file db.js in which is connect() function
const bodyParser = require('body-parser');

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index')
})

const userRouter = require('./routes/users')
const projectsRouter = require('./routes/projects')

app.use('/users', userRouter)
app.use('/projects', projectsRouter)

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})

