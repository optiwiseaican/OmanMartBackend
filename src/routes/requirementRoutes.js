// src/routes/requirementRoutes.js

const express = require('express');
const {
  createRequirement,
  getRequirementById,
  getAllRequirements,
  updateRequirementById,
  deleteRequirementById,
  searchRequirements,
} = require('../controllers/requirementController');

const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

router
  .route('/')
  .get(getAllRequirements)
  .post(authenticateUser, createRequirement);

router.route('/search').post(searchRequirements);
router
  .route('/:id')
  .get(getRequirementById)
  .put(authenticateUser, updateRequirementById)
  .delete(authenticateUser, deleteRequirementById);

module.exports = router;
