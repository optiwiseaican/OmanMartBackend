// src/routes/requirementRoutes.js

const express = require('express');
const {
    createRequirement,
    getRequirementById,
    getAllRequirements,
    updateRequirementById,
    deleteRequirementById,
    searchRequirements
} = require('../controllers/requirementController');

const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/', authenticateUser, createRequirement);
router.get('/', getAllRequirements);
router.get('/search', searchRequirements);
router.get('/:id', getRequirementById);
router.put('/:id', authenticateUser, updateRequirementById);
router.delete('/:id', authenticateUser, deleteRequirementById);

module.exports = router;
