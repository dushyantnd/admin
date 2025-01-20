import jwt from "jsonwebtoken";

// Middleware to validate JWT token
export const authenticate = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized. No token provided." });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify the JWT
    return decoded;
  } catch (error) {
    res.status(401).json({ error: "Unauthorized. Invalid token." });
    return null;
  }
};
