import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Pagination, Modal } from 'react-bootstrap';
import AdminSidebar from "../../../components/AdminSidebar";

const Home = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/file');
            const data = await res.json();
            if (res.ok) {
                setFiles(data.files);
            } else {
                console.error('Error fetching files:', data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (fileName) {
            formData.append('fileName', fileName);
        }

        try {
            const res = await fetch('/api/file', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('File uploaded/updated successfully!');
                fetchFiles(); // Refresh the file list
                setShowUploadModal(false); // Close modal
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('An error occurred during file upload.');
        }
    };

    const handleViewFile = (file) => {
        setSelectedFile(file);
        setShowViewModal(true);
    };

    const handleDeleteFile = async (fileId) => {
        if (confirm("Are you sure you want to delete this file?")) {
            try {
                const res = await fetch(`/api/files/${fileId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setMessage('File deleted successfully!');
                    fetchFiles(); // Refresh the file list
                } else {
                    const data = await res.json();
                    setMessage(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error('Delete error:', error);
                setMessage('An error occurred during file deletion.');
            }
        }
    };

    // Filter files based on the search query
    const filteredFiles = files.filter((file) =>
        file.fileName.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">File Management</h4>
                    </div>
                    <div className="p-4">
                        {/* Search and Filter */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 d-flex justify-content-end">
                                <button type="button" onClick={() => setShowUploadModal(true)} className="btn btn-dark">Add/Update File</button>
                            </div>
                        </div>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File Name</th>
                                    <th>File Url</th>
                                    <th>Uploaded At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiles.length > 0 ? (
                                    currentFiles.map((file, index) => (
                                        <tr key={file._id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{file.fileName}</td>
                                            <td>{file.url}
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => navigator.clipboard.writeText(file.url)}
                                                >
                                                    Copy
                                                </Button></td>
                                            <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                                            <td>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleViewFile(file)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteFile(file._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No files found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <Pagination>
                            {[...Array(totalPages).keys()].map((pageNumber) => (
                                <Pagination.Item
                                    key={pageNumber + 1}
                                    active={currentPage === pageNumber + 1}
                                    onClick={() => handlePageChange(pageNumber + 1)}
                                >
                                    {pageNumber + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>

                        {/* Upload/Update Modal */}
                        <Modal
                            show={showUploadModal}
                            onHide={() => setShowUploadModal(false)}
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Add or Update File</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleUploadSubmit}>
                                    <Form.Group>
                                        <Form.Label>File</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChange} />
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Form.Label>File Name (for updating)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            placeholder="Optional for updates"
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">
                                        Upload/Update
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/* View File Modal */}
                        <Modal
                            show={showViewModal}
                            onHide={() => setShowViewModal(false)}
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>View File</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedFile && (
                                    <>
                                        <p>
                                            <strong>File Name:</strong> {selectedFile.fileName}
                                        </p>
                                        <p>
                                            <strong>Uploaded At:</strong>{' '}
                                            {new Date(selectedFile.uploadedAt).toLocaleString()}
                                        </p>
                                        <a
                                            href={selectedFile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                        >
                                            View File
                                        </a>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
