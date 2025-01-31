// pages/api/universities/[id].js (Get, Update, and Delete API)
import dbConnect from "../../../utils/dbConnect";
import University from "../../../models/University";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const university = await University.findById(id);
      if (!university) return res.status(404).json({ message: "University not found" });
      res.status(200).json(university);
    } catch (error) {
      res.status(500).json({ message: "Error fetching university" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedUniversity = await University.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUniversity) return res.status(404).json({ message: "University not found" });
      res.status(200).json(updatedUniversity);
    } catch (error) {
      res.status(500).json({ message: "Error updating university" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedUniversity = await University.findByIdAndDelete(id);
      if (!deletedUniversity) return res.status(404).json({ message: "University not found" });
      res.status(200).json({ message: "University deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting university" });
    }
  }
}