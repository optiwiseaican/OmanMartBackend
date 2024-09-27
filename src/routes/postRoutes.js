const express = require('express');
const {
  createPost,
  getPostById,
  getAllPosts,
  getPostsByQuery,
  updatePostById,
  deletePostById,
  searchPosts,
  userFeed,
} = require('../controllers/postController');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

router.route('/').get(getAllPosts).post(authenticateUser, createPost);
router.route('/search').post(searchPosts);
router.route('/query').get(getPostsByQuery);
router
  .route('/:id')
  .get(getPostById)
  .put(authenticateUser, updatePostById)
  .delete(authenticateUser, deletePostById);

router.get('/user-feed/:userId', userFeed);

module.exports = router;
