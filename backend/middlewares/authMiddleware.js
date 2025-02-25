const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(require("../serviceAccount.json")),
});

const db = admin.firestore();

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Access Denied. Admins Only" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error while verifying the admin" });
  }
};

module.exports = { verifyToken, verifyAdmin };
