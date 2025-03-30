const admin = require("firebase-admin");

const db = admin.firestore();

const getUserRole = async (req, res) => {
  try {
    
    const { uid } = req.params;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const role = userData?.role || "user"; 

    return res.json({ role });
  } catch (error) {
    console.error("Error Fetching the user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUserRole;
