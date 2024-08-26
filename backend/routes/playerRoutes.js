const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const playersController = require('../controllers/playersController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/register',
    [
        body('username').isString().trim().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters.'),
        body('password').isString().isLength({ min: 5 }).withMessage('Password must be at least 5 characters.')
    ],
    playersController.register
);
router.post('/login',
    [
        body('username').isString().trim().notEmpty().withMessage('Username is required.'),
        body('password').isString().notEmpty().withMessage('Password is required.')
    ],
    playersController.login
);
router.post('/logout', playersController.logout);
router.get('/leaderboard', authenticateJWT, playersController.getLeaderboard);
router.get('/', authenticateJWT, playersController.getAllPlayers);
router.get('/:username',
    [
        param('username').isString().trim().notEmpty().withMessage('Username is required.')
    ],
    playersController.getPlayerByUsername
);
router.put('/:username',
    authenticateJWT,
    [
        param('username').isString().trim().notEmpty().withMessage('Username is required.'),
        body('rewards').isArray().optional(),
        body('isOnline').isBoolean().optional()
    ],
    playersController.updatePlayer
);
router.delete('/delete/:username', authenticateJWT, playersController.deletePlayer);

module.exports = router;
