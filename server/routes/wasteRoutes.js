const express = require('express');
const router = express.Router();
const { addWaste, getAllWaste, getWasteAnalysis, chatQuestionAnalysis } = require('../controllers/wasteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addWaste);
router.get('/', getAllWaste);
router.get('/analysis', getWasteAnalysis);
router.post('/chat', chatQuestionAnalysis);

module.exports = router;
