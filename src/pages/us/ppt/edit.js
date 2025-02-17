import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Button } from "react-bootstrap";
import AdminSidebar from "../../../components/AdminSidebar";

const EditPPT = () => {
    const router = useRouter();
    const { id } = router.query; // Get the PPT ID from the URL
    const [pptType, setPPTType] = useState("type_one");
    const [headerTitle, setHeaderTitle] = useState("");
    const [headerLogo, setHeaderLogo] = useState("");
    const [footerText, setFooterText] = useState("");
    const [footerLogo, setFooterLogo] = useState("");
    const [textEntries, setTextEntries] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [hintLine, setHintLine] = useState("");

    // Fetch the PPT details when the component loads
    useEffect(() => {
        if (id) {
            fetch(`/api/ppt?id=${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        const ppt = data;
                        setPPTType(ppt.type);
                        setHeaderTitle(ppt.header.title);
                        setHeaderLogo(ppt.header.logo);
                        setFooterText(ppt.footer.text);
                        setFooterLogo(ppt.footer.logo);
                        setTextEntries(ppt.textEntries || []);
                        setQuestions(ppt.questions || []);
                        setHintLine(ppt.hintLine || "");
                    } else {
                        alert("Failed to fetch PPT details");
                    }
                });
        }
    }, [id]);

    const handleAddTextEntry = () => {
        setTextEntries([...textEntries, { title: "", description: "" }]);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: [] }]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            type: pptType,
            header: { title: headerTitle, logo: headerLogo },
            footer: { text: footerText, logo: footerLogo },
        };

        if (pptType === "type_one") {
            payload.textEntries = textEntries;
            payload.hintLine = hintLine;
        } else {
            payload.questions = questions;
        }

        const res = await fetch(`/api/ppt?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert("PPT updated successfully");
            router.push("/us/ppt/list");
        } else {
            alert("Error updating PPT");
        }
    };

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Edit PPT</h4>
                    </div>
                    <Form className="p-4" onSubmit={handleUpdate}>
                        <Form.Group>
                            <Form.Label>PPT Type</Form.Label>
                            <Form.Select
                                value={pptType}
                                onChange={(e) => setPPTType(e.target.value)}
                            >
                                <option value="type_one">Type One</option>
                                <option value="type_two">Type Two</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Header Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerTitle}
                                onChange={(e) => setHeaderTitle(e.target.value)}
                                placeholder="Header Title"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Header Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerLogo}
                                onChange={(e) => setHeaderLogo(e.target.value)}
                                placeholder="Header Logo URL"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Footer Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                placeholder="Footer Text"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Footer Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerLogo}
                                onChange={(e) => setFooterLogo(e.target.value)}
                                placeholder="Footer Logo URL"
                            />
                        </Form.Group>

                        {pptType === "type_one" && (
                            <>
                                <h4>Text Entries</h4>
                                {textEntries.map((entry, index) => (
                                    <div key={index} className="mb-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Title"
                                            value={entry.title}
                                            onChange={(e) =>
                                                setTextEntries(
                                                    textEntries.map((item, i) =>
                                                        i === index ? { ...item, title: e.target.value } : item
                                                    )
                                                )
                                            }
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Description"
                                            value={entry.description}
                                            onChange={(e) =>
                                                setTextEntries(
                                                    textEntries.map((item, i) =>
                                                        i === index ? { ...item, description: e.target.value } : item
                                                    )
                                                )
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                ))}
                                <Button variant="secondary" onClick={handleAddTextEntry}>
                                    Add Text Entry
                                </Button>
                                <Form.Group>
                                    <Form.Label>Hint Line</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={hintLine}
                                        onChange={(e) => setHintLine(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}

                        {pptType === "type_two" && (
                            <>
                                <h4>Questions</h4>
                                {questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mb-4 border rounded p-3">
                                        <Form.Group>
                                            <Form.Label>Question {questionIndex + 1}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter question"
                                                value={question.question}
                                                onChange={(e) =>
                                                    setQuestions(
                                                        questions.map((q, i) =>
                                                            i === questionIndex ? { ...q, question: e.target.value } : q
                                                        )
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                        <h5 className="mt-3">Options</h5>
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="d-flex align-items-center mb-2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                    value={option}
                                                    onChange={(e) =>
                                                        setQuestions(
                                                            questions.map((q, i) =>
                                                                i === questionIndex
                                                                    ? {
                                                                        ...q,
                                                                        options: q.options.map((opt, j) =>
                                                                            j === optionIndex ? e.target.value : opt
                                                                        ),
                                                                    }
                                                                    : q
                                                            )
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() =>
                                                        setQuestions(
                                                            questions.map((q, i) =>
                                                                i === questionIndex
                                                                    ? {
                                                                        ...q,
                                                                        options: q.options.filter((_, j) => j !== optionIndex),
                                                                    }
                                                                    : q
                                                            )
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() =>
                                                setQuestions(
                                                    questions.map((q, i) =>
                                                        i === questionIndex
                                                            ? { ...q, options: [...q.options, ""] }
                                                            : q
                                                    )
                                                )
                                            }
                                        >
                                            Add Option
                                        </Button>
                                        <div className="mt-3">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    setQuestions(questions.filter((_, i) => i !== questionIndex))
                                                }
                                            >
                                                Remove Question
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="secondary" className="mt-3" onClick={handleAddQuestion}>
                                    Add Question
                                </Button>
                            </>
                        )}

                        <Button variant="primary" type="submit" className="mt-3">
                            Update PPT
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditPPT;
