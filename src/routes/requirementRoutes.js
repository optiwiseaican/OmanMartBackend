// src/routes/requirementRoutes.js

const express = require('express');
const {
  createRequirement,
  getRequirementById,
  getAllRequirements,
  updateRequirementById,
  deleteRequirementById,
  searchRequirements,
  getSellerRelevantRequirements,
  requirementFeed,
  getRelevantRequirementsForPost
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

router.get('/relevant-requirements/:userId', authenticateUser, getSellerRelevantRequirements);

router.get('/requirement-feed/:userId', requirementFeed);
router.get('/req-for-this-post/:postId', getRelevantRequirementsForPost)


module.exports = router;
