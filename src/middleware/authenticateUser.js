const admin = require('../configs/firebaseAdmin'); // Import your Firebase Admin initialization

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // Store the decoded token in the request object
      next(); // Move to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateUser;
