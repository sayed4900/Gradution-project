const predictController = require('../controllers/predict') ; 

const router = require('express').Router() ; 

router.post('/predict',predictController.predict)


module.exports = router;