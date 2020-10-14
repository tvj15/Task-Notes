const express = require('express')
const User = require('../models/User')
const authorize = require('../middlewares/authorize')
const router = new express.Router()


router.post('/register', async(req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthCode()
        await user.save()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthCode()
        await user.save()
        res.status(200).send({ user, token })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.post('/me/logout', authorize, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ message: 'Logged out.' })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/me/logoutAll', authorize, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: 'Logged out all.' })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/me', authorize, async(req, res) => {
    res.status(200).send(req.user)
})

router.patch('/me', authorize, async(req, res) => {
    const updates = Object.keys(req.body)
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }

})

router.delete('/me', authorize, async(req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)

    } catch (err) {
        res.status(500).send(err)
    }
})
module.exports = router