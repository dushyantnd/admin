import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import Link from "next/link";

export default function PostList() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 10; // Number of posts per page

  // Fetch posts from API
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/news-posts", {
        params: {
          page: currentPage,
          limit,
          status: filterStatus !== "all" ? filterStatus : undefined,
          search,
        },
      });
      const { posts, total } = response.data;
      setPosts(posts);
      setTotalPosts(total);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts on component mount or when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, filterStatus, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handleView = (post) => {
    setSelectedPost(post);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/news-posts?id=${id}`);
        alert("Post deleted successfully.");
        fetchPosts(); // Refresh the post list after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Post List</h4>
          </div>
          <div className="p-4">
            {/* Search and Filter */}
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or slug..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <Link href={"/us/newsPost/create"}>
                  <button type="button" className="btn btn-dark">Add New Post</button>
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{width:'400px'}}>Title</th>
                    <th style={{width:'350px'}}>Slug</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post._id}>
                        <td>{post?.title}</td>
                        <td>{post?.slug}</td>
                        <td>{post?.category_id?.name}</td>
                        <td>
                          <span
                            className={`badge ${post.status === "published"
                              ? "bg-success"
                              : post.status === "draft"
                                ? "bg-secondary"
                                : "bg-warning"
                              }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleView(post)}
                            data-bs-toggle="modal"
                            data-bs-target="#viewModal"
                          >
                            View
                          </button>
                          <Link href={`/us/newsPost/update?id=${post._id}`}> <button className="btn btn-sm btn-primary me-2">Edit</button></Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(post._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="viewModal"
        tabIndex="-1"
        aria-labelledby="viewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewModalLabel">
                {selectedPost?.title || "View Post"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p><strong>Slug:</strong> {selectedPost?.slug}</p>
              <p><strong>Status:</strong> {selectedPost?.status}</p>
              <div dangerouslySetInnerHTML={{ __html: selectedPost?.content }} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
