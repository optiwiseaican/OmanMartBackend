const Post = require('../models/postModel');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a list of all posts with pagination
exports.getAllPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const posts = await Post.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Post.countDocuments();
        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a list of posts with query and pagination
exports.getPostsByQuery = async (req, res) => {
    const { author, tags } = req.query;
    const { page = 1, limit = 10 } = req.query;
    let query = {};

    if (author) query.author = author;
    if (tags) query.tags = { $in: tags.split(',') };

    try {
        const posts = await Post.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Post.countDocuments(query);
        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a post by ID
exports.updatePostById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a post by ID
exports.deletePostById = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search posts
exports.searchPosts = async (req, res) => {
    const { query } = req.query;
    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        }).exec();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
