require('dotenv').config()
const express = require('express')
require('./db/mongodb')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use('/user', userRouter)
app.use('/user/me/task', taskRouter)

app.get('/', (req, res) => {
    res.json({
        'message': 'Index'
    })
})

app.listen(port, (err) => {
    if (err){
        return console.log(err)
    }
    console.log(`Listening on http://localhost:${port}`)
})