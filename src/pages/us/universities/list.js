import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import Link from "next/link";
import { Form, Button } from 'react-bootstrap';
import { useRouter } from "next/router";
export default function UniversityList() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [totalUniversities, setTotalUniversities] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const limit = 10; // Number of universities per page

    // Fetch universities from API
    const fetchUniversities = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/universities", {
                params: {
                    page: currentPage,
                    limit,
                    search,
                },
            });
            const { universities, total } = response.data;
            setUniversities(universities);
            setTotalUniversities(total);
        } catch (error) {
            console.error("Error fetching universities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch universities on component mount or when dependencies change
    useEffect(() => {
        fetchUniversities();
    }, [currentPage, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to the first page on a new search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalUniversities / limit);

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Universities List</h4>
                    </div>
                    <div className="p-4">
                        {/* Search */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by university name..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>State</th>
                                        <th>Logo</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : universities.length > 0 ? (
                                        universities.map((university) => (
                                            <tr key={university.rank}>
                                                <td>{university.rank}</td>
                                                <td>{university.name}</td>
                                                <td>{university.state}</td>
                                                <td>
                                                    <img
                                                        src={university.logo}
                                                        alt={university.name}
                                                        style={{ width: "50px", height: "50px" }}
                                                    />
                                                </td>
                                                <td>
                                                    
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => {
                                                            router.push(`/us/universities/update?id=${university._id}`)
                                                        }}
                                                    >
                                                        Edit
                                                    </Button> &nbsp;
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => onDelete(ppt._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No universities found.
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
        </div>
    );
}
