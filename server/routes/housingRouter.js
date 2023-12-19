const Router = require('express')
const router = new Router()
const housingController = require('../controllers/housingController')

router.post('/create', housingController.create)
router.post('/rent', housingController.rent)
router.post('/review/:id', housingController.addReview)
router.post('/update/:id', housingController.update)
router.get('/all-review/:id', housingController.getReview)
router.get('/del-review/:id', housingController.deleteReview)
router.get('/one-review/:id', housingController.getOneReview)
router.get('/delete/:id', housingController.deleteHouing)
router.get('/renters/:id', housingController.getRenters)
router.get('/censele/rent/:id', housingController.canseleRent)
router.get('/', housingController.getAll)
router.get('/:id', housingController.getOne)

module.exports = router