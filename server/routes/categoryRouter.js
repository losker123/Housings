const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/create', checkRole('ADMIN'), categoryController.create)
router.get('/', categoryController.getAll)
router.get('/delete/:id', categoryController.delete)

module.exports = router