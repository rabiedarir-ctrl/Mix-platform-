const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const loggingMiddleware = require('../middlewares/loggingMiddleware');
const errorHandler = require('../middlewares/errorHandler');

// Modules
const cellsRoutes = require('../modules/cells/cellRoutes');
const gamesRoutes = require('../modules/games/gameRoutes');
const walletRoutes = require('../modules/wallet/walletRoutes');
const socialRoutes = require('../modules/social/socialRoutes');

// تطبيق Logging Middleware لجميع الطلبات
router.use(loggingMiddleware);

// مسارات عامة غير محمية
router.get('/status', (req, res) => {
    res.json({ status: 'Mix Platform API is running 🚀', timestamp: new Date() });
});

// مسارات محمية تتطلب JWT
router.use(authMiddleware);

// ربط مسارات الموديولات
router.use('/cells', cellsRoutes);
router.use('/games', gamesRoutes);
router.use('/wallet', walletRoutes);
router.use('/social', socialRoutes);

// أي Route غير موجود
router.use((req, res, next) => {
    const err = new Error('API endpoint not found');
    err.status = 404;
    next(err);
});

// Middleware لإدارة الأخطاء
router.use(errorHandler);

module.exports = router;
