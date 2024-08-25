const express = require('express');
const router = express.Router();
const lootboxController = require('../controllers/lootboxesController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/create', authenticateJWT, lootboxController.createLootboxes);
router.post('/open/:id', authenticateJWT, lootboxController.openLootbox);
router.get('/', authenticateJWT, lootboxController.getAllLootboxes);
router.delete('/deleteAll', authenticateJWT, lootboxController.deleteAllLootboxes);
router.get('/:id', authenticateJWT, lootboxController.getLootboxById);
router.put('/update/:id', authenticateJWT, lootboxController.updateLootbox);
router.delete('/delete/:id', authenticateJWT, lootboxController.deleteLootbox);

module.exports = router;
