const express = require('express')
const Task = require('../models/Task')
const authorize = require('../middlewares/authorize')
const router = new express.Router()


// GET /?completed=true
// GET /?limit=1&skip=1
// GET /?sortBy=createdAt:(asc)or(desc)
// GET /?sortBy=completed:(asc)or(desc)
router.get('/', authorize, async(req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        if (req.query.completed === 'true') {
            match.completed = true
        } else if (req.query.completed === 'false') {
            match.completed = false
        }
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
})

router.get('/:id', authorize, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        if (!task) {
            return res.status(404).send({ message: "Task Not Found." })
        }
        res.status(200).send(task)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
})

router.post('/', authorize, async(req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id,
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router