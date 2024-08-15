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

const router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/query', getPostsByQuery);
router.get('/:id', getPostById);
router.put('/:id', updatePostById);
router.delete('/:id', deletePostById);

module.exports = router;
