const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const familyController = require('../controllers/familyController');

router.post('/add', protect, familyController.addFamilyMember);
router.get('/members', protect, familyController.getFamilyMembers);
router.put('/:id', protect, familyController.updateFamilyMember);
router.delete('/:id', protect, familyController.deleteFamilyMember);

module.exports = router;