import { useState } from "react";
import Link from "next/link";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 bg-primary text-white ${isCollapsed ? "collapsed" : ""
        }`}
      style={{
        width: isCollapsed ? "80px" : "250px",
        height: "100vh",
        transition: "width 0.3s",
      }}
    >
      {/* Sidebar Header */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {!isCollapsed && (
          <div>
            {/* <h5 className="mb-0">US-PUPILS</h5> */}
            <small>ADMIN</small>
          </div>
        )}
        <button
          className="btn btn-sm btn-light"
          style={{ border: "none" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li
          className="nav-item"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                }`}
            >
              <i className="bi bi-house-fill me-2 text-info"></i>
              {!isCollapsed && "Home"}
            </a>
          </Link>
        </li>
        <li
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/us/newsCategory/list" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                }`}
            >
              <i className="bi bi-folder-fill me-2 text-info"></i>
              {!isCollapsed && "Category"}
            </a>
          </Link>
        </li>
        <li
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/us/newsPost/list" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                }`}
            >
              <i className="bi bi-journal-text me-2 text-info"></i>
              {!isCollapsed && "Post"}
            </a>
          </Link>
        </li>
        <li
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/us/files/" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                }`}
            >
              <i className="bi bi-images me-2 text-info"></i>
              {!isCollapsed && "FIles"}
            </a>
          </Link>
        </li>
        <li
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/us/ppt/list" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                }`}
            >
              <i className="bi bi-gear-fill me-2 text-info"></i>
              {!isCollapsed && "Quiz & PPT"}
            </a>
          </Link>
        </li>
        <li
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Link href="/us/universities/list" legacyBehavior>
            <a
              className={`nav-link text-white px-3 py-2 d-flex align-items-center ${
                isCollapsed ? "justify-content-center" : ""
              }`}
            >
              <i className="bi bi-envelope-fill me-2 text-info"></i>
              {!isCollapsed && "Universities"}
            </a>
          </Link>
        </li> 
      </ul>

      {/* Footer */}
      <div
        className="mt-auto p-3"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          fontSize: "0.9rem",
        }}
      >
        {!isCollapsed && (
          <>
            <p>
              <Link href="#" legacyBehavior>
                <a
                  className={`nav-link text-white px-3 py-2 d-flex align-items-center ${isCollapsed ? "justify-content-center" : ""
                    }`}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  <i className="bi  bi-box-arrow-right me-2 text-info"></i>
                  {!isCollapsed && "Logout"}
                </a>
              </Link>
            </p>
            <small>Copyright ©2025 All rights reserved</small>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
