const upload = require('../middleware/multer');
const predictController = require('../controllers/predict') ; 

const router = require('express').Router() ; 

router.post('/predict',predictController.predict)
router.post('/predict/model1',upload.single('file'),predictController.predictModelOne)


module.exports = router;