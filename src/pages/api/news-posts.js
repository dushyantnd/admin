import dbConnect from "../../utils/dbConnect";
import NewsPost from "../../models/NewsPost";
import NewsCategory from "../../models/NewsCategory";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  switch (req.method) {
    case "POST":
      return createPost(req, res);
    case "GET":
      if (req.query.search) {
        return searchPosts(req, res); // Call the search function if `search` query exists
      }
      if (req.query.slug) {
        return getPostBySlug(req, res);
      }
      if (req.query.id) {
        return getPostById(req, res);
      }
      return getAllPosts(req, res);
    case "PUT":
      return updatePostById(req, res);
    case "DELETE":
        return deletePostById(req, res);  
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// Create a new post
async function createPost(req, res) {
  try {
    const post = new NewsPost(req.body);
    await post.save();
    res.status(201).json({ message: "News Post created", post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all posts with pagination
async function getAllPosts(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query; // Defaults to page 1 and 10 posts per page
    const skip = (page - 1) * limit;

    const posts = await NewsPost.find()
      .sort({ createdAt: -1 })
      .populate({ path: "category_id", select: "name slug" }) // Populate category name and slug
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsPost.countDocuments();
    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a post by slug
async function getPostBySlug(req, res) {
  try {
    const { slug } = req.query;
    const post = await NewsPost.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a post by ID
async function getPostById(req, res) {
  try {
    const { id } = req.query;
    const post = await NewsPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Search posts by title
// Search posts by title with pagination
async function searchPosts(req, res) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    if (!search.trim()) {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }

    const skip = (page - 1) * limit;

    // Perform a case-insensitive search on the title field
    const posts = await NewsPost.find({
      title: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "category_id", select: "name slug" }) // Populate category name and slug
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsPost.countDocuments({
      title: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Update a post by ID
async function updatePostById(req, res) {
  try {
    const { id } = req.query;
    const updatedPost = await NewsPost.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updates
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated", updatedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a post by ID
async function deletePostById(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const deletedPost = await NewsPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}