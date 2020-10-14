const mongoose = require('mongoose')


const url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true },
    async(err) => {
        if(err){
            return console.log(err)
        }
        return console.log('MongoDB Connected...')
    })