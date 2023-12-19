const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const housingRouter = require('./housingRouter')
const categoryRouter = require('./categoryRouter')

router.use('/user', userRouter)
router.use('/housing', housingRouter)
router.use('/category', categoryRouter)

module.exports = router