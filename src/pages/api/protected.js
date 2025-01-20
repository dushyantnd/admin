import { authenticate } from "../../utils/authMiddleware";

export default function handler(req, res) {
  const user = authenticate(req, res); // Validate token
  if (!user) return; // Exit if not authenticated

  // Proceed with the protected logic
  res.status(200).json({ message: "This is a protected route.", user });
}
