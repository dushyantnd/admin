import dbConnect from "../../utils/dbConnect";
import NewsCategory from "../../models/NewsCategory";

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection

  switch (req.method) {
    case "POST":
      return createCategory(req, res);
    case "GET":
      if (req.query.id) return getCategoryById(req, res);
      if (req.query.slug) return getCategoryBySlug(req, res);
      return getAllCategories(req, res);
    case "PUT":
      return updateCategory(req, res);
    case "DELETE":
      return deleteCategory(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const category = new NewsCategory(req.body);
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all categories with pagination
async function getAllCategories(req, res) {
  try {
    // Extract page and limit from query parameters with defaults
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch categories with pagination
    const categories = await NewsCategory.find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit);

    // Get the total count of categories for pagination metadata
    const totalCategories = await NewsCategory.countDocuments();
    // Send response with categories and pagination metadata
    res.status(200).json({
      categories,
      pagination: {
        totalCategories,
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Get category by ID
async function getCategoryById(req, res) {
  try {
    const { id } = req.query;
    const category = await NewsCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get category by slug
async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.query;
    const category = await NewsCategory.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update category
async function updateCategory(req, res) {
  try {
    const { id } = req.query;
    const updatedCategory = await NewsCategory.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before saving
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete category
async function deleteCategory(req, res) {
  try {
    const { id } = req.query;
    const deletedCategory = await NewsCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
