const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/register', playersController.register);
router.post('/login', playersController.login);
router.post('/logout', playersController.logout);
router.get('/leaderboard', authenticateJWT, playersController.getLeaderboard);
router.get('/', authenticateJWT, playersController.getAllPlayers);
router.get('/:username', authenticateJWT, playersController.getPlayerByUsername);
router.put('/update/:username', authenticateJWT, playersController.updatePlayer);
router.delete('/delete/:username', authenticateJWT, playersController.deletePlayer);

module.exports = router;
