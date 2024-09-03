const Requirement = require('../models/requirementModel');

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
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a requirement by ID
exports.updateRequirementById = async (req, res) => {
    try {
        const requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
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

exports.searchRequirements = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    try {
        const requirements = await Requirement.find({
            $or: [
                { requirementTitle: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Requirement.countDocuments({
            $or: [
                { requirementTitle: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        });

        res.json({
            requirements,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

