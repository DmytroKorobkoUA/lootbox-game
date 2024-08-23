const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');
const authenticateJWT = require("../middleware/authenticateJWT");

router.post('/create', authenticateJWT, rewardsController.createReward);
router.get('/', authenticateJWT, rewardsController.getAllRewards);
router.get('/:id', authenticateJWT, rewardsController.getRewardById);
router.put('/update/:id', authenticateJWT, rewardsController.updateReward);
router.delete('/delete/:id', authenticateJWT, rewardsController.deleteReward);

module.exports = router;
