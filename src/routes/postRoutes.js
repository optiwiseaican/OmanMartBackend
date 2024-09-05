const express = require('express');
const {
    createPost,
    getPostById,
    getAllPosts,
    getPostsByQuery,
    updatePostById,
    deletePostById,
    searchPosts
} = require('../controllers/postController');
const authenticateUser = require('../middleware/authenticateUser');  

const router = express.Router();

router.post('/', authenticateUser, createPost);
router.get('/', getAllPosts);
router.post('/search', searchPosts);
router.get('/query', getPostsByQuery);
router.get('/:id', getPostById);
router.put('/:id', authenticateUser, updatePostById);
router.delete('/:id', authenticateUser, deletePostById);

module.exports = router;
