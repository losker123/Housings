const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/auth', authMiddleware, userController.ceck)
router.get('/renters/:id', authMiddleware, userController.getUserRenters)
router.get('/reviews/:id', authMiddleware, userController.getUserReview)
router.get('/owner/:id', authMiddleware, userController.getUserHousing)


module.exports = router