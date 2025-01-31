
// pages/api/universities/index.js (List and Create API)
import dbConnect from "../../utils/dbConnect";
import University from "../../models/University";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const query = search ? { name: { $regex: search, $options: "i" } } : {};
      const universities = await University.find(query)
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ rank: 1 });
      const total = await University.countDocuments(query);

      res.status(200).json({ universities, total });
    } catch (error) {
      res.status(500).json({ message: "Error fetching universities" });
    }
  } else if (req.method === "POST") {
    try {
      const university = await University.create(req.body);
      res.status(201).json(university);
    } catch (error) {
      res.status(400).json({ message: "Error creating university" });
    }
  }
}