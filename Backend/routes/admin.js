const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// All routes here are protected by adminAuth
router.use(adminAuth);

router.get('/stats', adminController.getStats);
router.get('/stats/daily-registrations', adminController.getDailyRegistrations);
router.get('/stats/religion-distribution', adminController.getReligionDistribution);
router.get('/stats/city-distribution', adminController.getCityDistribution);
router.get('/stats/monthly-revenue', adminController.getMonthlyRevenue);
router.get('/stats/plan-distribution', adminController.getPlanDistribution);
router.get('/activity', adminController.getActivity);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/detail', adminController.getUserDetail);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/toggle-verify', adminController.toggleVerify);

router.put('/ban-user/:userId', adminController.banUser);
router.put('/unban-user/:userId', adminController.unbanUser);
router.put('/verify-user/:userId', adminController.verifyUser);
router.put('/unverify-user/:userId', adminController.unverifyUser);

module.exports = router;
