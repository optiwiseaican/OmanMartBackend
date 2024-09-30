const Post = require('../models/postModel');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      postTable: req.body.postTable || [],
    });

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
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a list of posts with query and pagination
exports.getPostsByQuery = async (req, res) => {
  const { author, tags } = req.query;
  const { page = 1, limit = 10 } = req.query;
  const query = {};

  if (author) query.author = author;
  if (tags) query.tags = { $in: tags.split(',') };

  try {
    const posts = await Post.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Post.countDocuments(query);
    const currentPage = parseInt(page, 10);
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post by ID
exports.updatePostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, postTable: req.body.postTable },
      { new: true, runValidators: true }
    );

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

// // Search posts
// exports.searchPosts = async (req, res) => {
//     const { query } = req.query;
//     try {
//         const posts = await Post.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } },
//                 { content: { $regex: query, $options: 'i' } },
//                 { author: { $regex: query, $options: 'i' } }
//             ]
//         }).exec();
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Search posts with pagination and location filter
exports.searchPosts = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query; // Query params
  const { locations = [] } = req.body; // Locations in request body

  try {
    // Build the base filters using the query
    const filters = { $text: { $search: query } };

    // Add location filter if locations are provided
    if (locations.length > 0) {
      filters.multiLocations = { $in: locations };
    }

    const posts = await Post.find(filters, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments(filters);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userFeed = async (req, res) => {
  try {
    const sellerId = req.params.userId;

    // last search records
    const firestoreDB = getFirestore();
    const userPreferences = firestoreDB.collection('user_preferences').doc(sellerId);
    const doc = await userPreferences.get();

    // Pagination query parameters
    const { page = 1, limit = 10 } = req.query;

    if (doc.exists) {
      const lastSearch = doc.data().last_search;

      if (Array.isArray(lastSearch)) {

        const searchString = lastSearch.map((searchTerm) => searchTerm).join(' ');

        const filters = {
          $text: { $search: searchString }
        };

        const posts = await Post.find(filters, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } }) 
          .limit(limit * 1) 
          .skip((page - 1) * limit) 
          .exec();

        const count = await Post.countDocuments(filters);

        res.json({
          posts,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page, 10),
        });
      } else {
        res.json({
          "data": "last_search is not an array",
        });
      }
    } else {
       // If the document does not exist, return posts in a random manner
       const posts = await Post.aggregate([
        {
          $sample: { size: parseInt(limit) } // Randomly select 'limit' number of posts
        }
      ]);

      const count = await Post.countDocuments({}); // Count all posts

      res.json({
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10),
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





