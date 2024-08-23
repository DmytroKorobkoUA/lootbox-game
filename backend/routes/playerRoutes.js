const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/register', playersController.register);
router.post('/login', playersController.login);
router.get('/', authenticateJWT, playersController.getAllPlayers);
router.get('/:username', authenticateJWT, playersController.getPlayerByUsername);
router.put('/update/:username', authenticateJWT, playersController.updatePlayer);
router.delete('/delete/:username', authenticateJWT, playersController.deletePlayer);

module.exports = router;
