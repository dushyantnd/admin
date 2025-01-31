import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import AdminSidebar from "../../../components/AdminSidebar";
import List from "./part";
import Link from 'next/link';
import PptxGenJS from "pptxgenjs";

const PPTPage = () => {
    const [ppts, setPPTs] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error handling
    const [search, setSearch] = useState(''); // Search input state
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const itemsPerPage = 5; // Items per page

    // Fetch PPT data from the API
    const fetchPPTs = async () => {
        setLoading(true); // Start loading
        try {
            const res = await fetch('/api/ppt');
            if (!res.ok) throw new Error('Failed to fetch PPTs');
            const data = await res.json();
            setPPTs(data.data); // Set fetched data
        } catch (err) {
            setError(err.message); // Handle error
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchPPTs();
    }, []);

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this PPT?")) {
            try {
                const res = await fetch(`/api/ppt?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchPPTs(); // Refresh the list after deletion
                } else {
                    alert("Failed to delete PPT.");
                }
            } catch (err) {
                alert("Error while deleting.");
            }
        }
    };

    // Handle pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter PPTs by search query
    const filteredPPTs = ppts.filter((ppt) =>
        ppt.header.title.toLowerCase().includes(search.toLowerCase())
    );

    const currentPPTs = filteredPPTs.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredPPTs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to generate and download PPT for a specific item
    const handleDownloadPPT = (ppt) => {
        const pptx = new PptxGenJS();
        if (ppt.type == 'type_one') {
            ppt.textEntries.forEach((entries, index) => {
                const slide = pptx.addSlide();

                // Add the header
                slide.addText(`${ppt.header.title}`, {
                    x: 0.5,
                    y: 0.3,
                    fontSize: 20,
                    bold: true,
                    color: "FFFFFF",
                    fill: { color: "e55039" },
                    align: "center",
                    w: "90%",
                    h: 0.6,
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 0.9,
                    w: "90%",
                    h: 0.08,
                    fill: { color: "00b894" },
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 1,
                    w: "90%",
                    h: 0.01,
                    fill: { color: "00b894" },
                });

                // Add the options
                // entries.forEach((option, optionIndex) => {
                //     slide.addText(
                //         `${String.fromCharCode(65 + optionIndex)}. ${option.title}`, // A, B, C, D for options
                //         {
                //             x: 1.5,
                //             y: 1.8 + optionIndex * 0.5, // Position each option below the previous one
                //             fontSize: 14,
                //             color: "1e3799", // Highlight correct answer in green
                //             bold: optionIndex === question.correctOption, // Bold correct option
                //             w: "90%",
                //         }
                //     );
                // });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 4.2,
                    w: "90%",
                    h: 0.01,
                    fill: { color: "00b894" },
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 4.3,
                    w: "90%",
                    h: 0.08,
                    fill: { color: "00b894" },
                });
                // Add the footer
                slide.addText(
                    "Railway, SSC, Teaching, DSSSB, and all competitive exams",
                    {
                        x: 0.5,
                        y: 4,
                        fontSize: 12,
                        bold: true,
                        color: "084594",
                        align: "center",
                        w: "90%",
                    }
                );

                // Add branding
                slide.addText("Edustream India", {
                    x: 0.2,
                    y: 4.9,
                    fontSize: 28,
                    bold: true,
                    color: "FF5722",
                    align: "center",
                    w: "90%",
                });

                // Add logo (optional)
                slide.addImage({
                    path: "https://res.cloudinary.com/did4hiibf/image/upload/v1737287441/uploads/qxp9jqrbceasydqlqzbc.jpg", // Replace with your logo URL
                    x: 2.5,
                    y: 4.5,
                    w: 0.8,
                    h: 0.8,
                });
            });
        } else {
            // Add a slide for each question
            ppt.questions.forEach((question, index) => {
                const slide = pptx.addSlide();

                // Add the header
                slide.addText(`${ppt.header.title}`, {
                    x: 0.5,
                    y: 0.3,
                    fontSize: 20,
                    bold: true,
                    color: "FFFFFF",
                    fill: { color: "e55039" },
                    align: "center",
                    w: "90%",
                    h: 0.6,
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 0.9,
                    w: "90%",
                    h: 0.08,
                    fill: { color: "00b894" },
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 1,
                    w: "90%",
                    h: 0.01,
                    fill: { color: "00b894" },
                });
                // Add the question
                slide.addText(`Q.${index + 1}: ${question.question}`, {
                    x: 1.5,
                    y: 1.28,
                    fontSize: 16,
                    bold: true,
                    color: "222222",
                    w: "80%",
                });

                // Add the options
                question.options.forEach((option, optionIndex) => {
                    slide.addText(
                        `${String.fromCharCode(65 + optionIndex)}. ${option}`, // A, B, C, D for options
                        {
                            x: 1.5,
                            y: 1.8 + optionIndex * 0.5, // Position each option below the previous one
                            fontSize: 14,
                            color: "1e3799", // Highlight correct answer in green
                            bold: optionIndex === question.correctOption, // Bold correct option
                            w: "90%",
                        }
                    );
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 4.2,
                    w: "90%",
                    h: 0.01,
                    fill: { color: "00b894" },
                });
                // add top line 
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 4.3,
                    w: "90%",
                    h: 0.08,
                    fill: { color: "00b894" },
                });
                // Add the footer
                slide.addText(
                    "Railway, SSC, Teaching, DSSSB, and all competitive exams",
                    {
                        x: 0.5,
                        y: 4,
                        fontSize: 12,
                        bold: true,
                        color: "084594",
                        align: "center",
                        w: "90%",
                    }
                );

                // Add branding
                slide.addText("Edustream India", {
                    x: 0.2,
                    y: 4.9,
                    fontSize: 28,
                    bold: true,
                    color: "FF5722",
                    align: "center",
                    w: "90%",
                });

                // Add logo (optional)
                slide.addImage({
                    path: "https://res.cloudinary.com/did4hiibf/image/upload/v1737287441/uploads/qxp9jqrbceasydqlqzbc.jpg", // Replace with your logo URL
                    x: 2.5,
                    y: 4.5,
                    w: 0.8,
                    h: 0.8,
                });
            });
        }
        // Export the PowerPoint
        pptx.writeFile(`${ppt.header.title.replace(/\s+/g, "_")}_PPT`);
    };
    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Dynamic PPT Generator</h4>
                    </div>
                    <div className="p-4">
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by header title"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mb-3"
                                />
                            </div>
                            <div className='col-md-6'>
                                <Link href={"/us/ppt/"}>
                                    <Button variant="dark" className="mb-3">
                                        Add Quiz
                                    </Button>
                                </Link>&nbsp;
                                <Link href={"/us/ppt/slide"}>
                                    <Button variant="primary" className="mb-3">
                                        Add Slide
                                    </Button>
                                </Link>
                            </div>
                        </div>




                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <List
                                ppts={currentPPTs}
                                onDelete={handleDelete}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                handleDownloadPPT={handleDownloadPPT}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PPTPage;
