const Requirement = require('../models/requirementModel');
const Product = require('../models/postModel');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const Post = require('../models/postModel');

// Create a new requirement
exports.createRequirement = async (req, res) => {
  try {
    const requirement = new Requirement(req.body);
    const savedRequirement = await requirement.save();
    res.status(201).json(savedRequirement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a requirement by ID
exports.getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.json(requirement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a list of all requirements with pagination
exports.getAllRequirements = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const requirements = await Requirement.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Requirement.countDocuments();
    res.json({
      requirements,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a requirement by ID
exports.updateRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.json(requirement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a requirement by ID
exports.deleteRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findByIdAndDelete(req.params.id);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search requirements
// exports.searchRequirements = async (req, res) => {
//     const { query } = req.query;
//     try {
//         const requirements = await Requirement.find({
//             $or: [
//                 { requirementTitle: { $regex: query, $options: 'i' } },
//                 { industryType: { $regex: query, $options: 'i' } },
//                 { location: { $regex: query, $options: 'i' } }
//             ]
//         }).exec();
//         res.json(requirements);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.searchRequirements = async (req, res) => {
//     const { query, page = 1, limit = 10 } = req.query;

//     try {
//         const requirements = await Requirement.find({
//             $or: [
//                 { requirementTitle: { $regex: query, $options: 'i' } },
//                 { category: { $regex: query, $options: 'i' } },
//                 { tags: { $in: [new RegExp(query, 'i')] } }
//             ]
//         })
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .exec();

//         const count = await Requirement.countDocuments({
//             $or: [
//                 { requirementTitle: { $regex: query, $options: 'i' } },
//                 { category: { $regex: query, $options: 'i' } },
//                 { tags: { $in: [new RegExp(query, 'i')] } }
//             ]
//         });

//         res.json({
//             requirements,
//             totalPages: Math.ceil(count / limit),
//             currentPage: parseInt(page, 10),
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.searchRequirements = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query; // Query params
  const { locations = [] } = req.body; // Locations in request body

  try {
    // Build the base filters using the query
    const filters = { $text: { $search: query } };

    // Add location filter if locations are provided
    if (locations.length > 0) {
      filters.multiLocations = { $in: locations };
    }

    const requirements = await Requirement.find(filters, {
      score: { $meta: 'textScore' },
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Requirement.countDocuments(filters);

    res.json({
      requirements,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get relevant requirements for a seller based on their posted products
exports.getSellerRelevantRequirements = async (req, res) => {
  const sellerId = req.params.userId; // Seller's userId passed as a route parameter

  try {
    // Fetch all products posted by this seller
    const sellerProducts = await Product.find({ postedBy: sellerId });

    if (!sellerProducts || sellerProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }

    // Combine all product titles into a single search string
    const searchString = sellerProducts.map((product) => product.title).join(' ');

    // Create a filter for text search based on titles only
    const filters = {
      $text: { $search: searchString }
    };

    const { page = 1, limit = 10 } = req.query;

    // Find buyer requirements matching seller's product titles
    const requirements = await Requirement.find(filters, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }) // Sort by textScore for relevance
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Count total matching requirements
    const count = await Requirement.countDocuments(filters);

    // Return the matching requirements with pagination
    res.json({
      requirements,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.requirementFeed = async (req, res) => {
  try {
    const sellerId = req.params.userId;

    // last search records from Firestore
    const firestoreDB = getFirestore();
    const userPreferences = firestoreDB.collection('user_preferences').doc(sellerId);
    const doc = await userPreferences.get();

    // Pagination query parameters
    const { page = 1, limit = 10 } = req.query;

    if (doc.exists) {
      const lastSearch = doc.data().last_search;

      if (Array.isArray(lastSearch)) {

        // Create search string from the last_search array
        const searchString = lastSearch.map((searchTerm) => searchTerm).join(' ');

        // Use MongoDB's text search to filter requirements based on the search string
        const filters = {
          $text: { $search: searchString }
        };

        // Find matching requirements, sorted by textScore
        const requirements = await Requirement.find(filters, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } }) // Sort by relevance based on textScore
          .limit(limit * 1) // Pagination: limit the number of results
          .skip((page - 1) * limit) // Pagination: skip documents for previous pages
          .exec();

        // Count total matching requirements for pagination
        const count = await Requirement.countDocuments(filters);

        // Return the matching requirements with pagination info
        res.json({
          requirements,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page, 10),
        });
      } else {
        res.json({
          "data": "last_search is not an array",
        });
      }
    } else {
      // If the document does not exist, return requirements in a random manner
      const requirements = await Requirement.aggregate([
        {
          $sample: { size: parseInt(limit) } // Randomly select 'limit' number of requirements
        }
      ]);

      const count = await Requirement.countDocuments({}); // Count all requirements

      // Return random requirements along with pagination info
      res.json({
        requirements,
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


exports.getRelevantRequirementsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Use the post's title and category for the search
    // const searchString = `${post.title} ${post.category.join(' ')}`;

    const searchString = `${post.title}`;


    // Pagination query parameters
    const { page = 1, limit = 10 } = req.query;

    // Create a text search filter using the post's title and category
    const filters = {
      $text: { $search: searchString }
    };

    // Find relevant requirements based on the post's title and category
    const requirements = await Requirement.find(filters, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }) // Sort by relevance based on textScore
      .limit(limit * 1) // Pagination: limit the number of results
      .skip((page - 1) * limit) // Pagination: skip documents for previous pages
      .exec();

    // Count total matching requirements for pagination
    const count = await Requirement.countDocuments(filters);

    // Return the relevant requirements along with pagination info
    res.json({
      requirements,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
