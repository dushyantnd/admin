import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import AdminSidebar from "../../../components/AdminSidebar";
import { useRouter } from 'next/router';
const PPTPage = () => {
    const router = useRouter();
    const [pptType, setPPTType] = useState('type_one');
    const [headerTitle, setHeaderTitle] = useState('');
    const [headerLogo, setHeaderLogo] = useState('https://res.cloudinary.com/did4hiibf/image/upload/v1737287441/uploads/qxp9jqrbceasydqlqzbc.jpg');
    const [footerText, setFooterText] = useState('Edustream India');
    const [footerLogo, setFooterLogo] = useState('https://res.cloudinary.com/did4hiibf/image/upload/v1737287441/uploads/qxp9jqrbceasydqlqzbc.jpg');
    const [textEntries, setTextEntries] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [hintLine, setHintLine] = useState('');
    const [ppts, setPPTs] = useState([]);

    const fetchPPTs = async () => {
        const res = await fetch('/api/ppt');
        const data = await res.json();
        if (res.ok) setPPTs(data.data);
    };

    useEffect(() => {
        fetchPPTs();
    }, []);

    const handleAddTextEntry = () => {
        setTextEntries([...textEntries, { title: '', description: '' }]);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: [] }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            type: pptType,
            header: { title: headerTitle, logo: headerLogo },
            footer: { text: footerText, logo: footerLogo },
        };

        if (pptType === 'type_one') {
            payload.textEntries = textEntries;
            payload.hintLine = hintLine;
        } else {
            payload.questions = questions;
        }

        const res = await fetch('/api/ppt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            fetchPPTs();
            alert('PPT saved successfully');
            router.push("/us/ppt/list")
        } else {
            alert('Error saving PPT');
        }
    };

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Dynamic PPT Generator</h4>
                    </div>
                    <Form className="p-4 row" onSubmit={handleSubmit}>
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
                        <Form.Group className='col-md-6'>
                            <Form.Label>Header Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerTitle}
                                onChange={(e) => setHeaderTitle(e.target.value)}
                                placeholder='Header Title'
                            />
                        </Form.Group>
                        <Form.Group className='col-md-6'>
                            <Form.Label>Footer Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                placeholder='Footer Text'
                            />
                        </Form.Group>
                        <Form.Group className='col-md-6'>
                            <Form.Label>Header Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerLogo}
                                onChange={(e) => setHeaderLogo(e.target.value)}
                                placeholder='Header Logo URL'
                            />
                        </Form.Group>
                        <Form.Group className='col-md-6'>
                            <Form.Label>Footer Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerLogo}
                                onChange={(e) => setFooterLogo(e.target.value)}
                                placeholder='Footer Logo URL'
                            />
                        </Form.Group>

                        {pptType === 'type_one' && (
                            <>
                                <h4>Slides</h4>
                                {textEntries.map((slide, slideIndex) => (
                                    <div key={slideIndex} className="mb-4 border rounded p-3">
                                        <h5>Slide {slideIndex + 1}</h5>
                                        {slide.entries.map((entry, entryIndex) => (
                                            <div key={entryIndex} className="mb-3 row">
                                                <Form.Group className="col-md-4">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder={`Title for Slide ${slideIndex + 1}`}
                                                        value={entry.title}
                                                        onChange={(e) =>
                                                            setTextEntries(
                                                                textEntries.map((s, i) =>
                                                                    i === slideIndex
                                                                        ? {
                                                                            ...s,
                                                                            entries: s.entries.map((e, j) =>
                                                                                j === entryIndex
                                                                                    ? { ...e, title: e.target.value }
                                                                                    : e
                                                                            ),
                                                                        }
                                                                        : s
                                                                )
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group className="col-md-4">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder={`Description for Slide ${slideIndex + 1}`}
                                                        value={entry.description}
                                                        onChange={(e) =>
                                                            setTextEntries(
                                                                textEntries.map((s, i) =>
                                                                    i === slideIndex
                                                                        ? {
                                                                            ...s,
                                                                            entries: s.entries.map((e, j) =>
                                                                                j === entryIndex
                                                                                    ? { ...e, description: e.target.value }
                                                                                    : e
                                                                            ),
                                                                        }
                                                                        : s
                                                                )
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <div className="col-md-2 d-flex align-items-end">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() =>
                                                            setTextEntries(
                                                                textEntries.map((s, i) =>
                                                                    i === slideIndex
                                                                        ? {
                                                                            ...s,
                                                                            entries: s.entries.filter((_, j) => j !== entryIndex),
                                                                        }
                                                                        : s
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Remove Entry
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="mb-3"
                                            onClick={() =>
                                                setTextEntries(
                                                    textEntries.map((s, i) =>
                                                        i === slideIndex
                                                            ? { ...s, entries: [...s.entries, { title: '', description: '' }] }
                                                            : s
                                                    )
                                                )
                                            }
                                        >
                                            Add Text Entry
                                        </Button>
                                        <div className="text-end">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setTextEntries(textEntries.filter((_, i) => i !== slideIndex))}
                                            >
                                                Remove Slide
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    variant="primary"
                                    className="mt-3"
                                    onClick={() =>
                                        setTextEntries([...textEntries, { entries: [{ title: '', description: '' }] }])
                                    }
                                >
                                    Add Slide
                                </Button>
                                <Form.Group className="mt-3">
                                    <Form.Label>Hint Line</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter hint line"
                                        value={hintLine}
                                        onChange={(e) => setHintLine(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}




                        {pptType === 'type_two' && (
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
                                                            ? { ...q, options: [...q.options, ''] }
                                                            : q
                                                    )
                                                )
                                            }
                                        >
                                            Add Option
                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="mt-3"
                                            onClick={() =>
                                                setQuestions(questions.filter((_, i) => i !== questionIndex))
                                            }
                                        >
                                            Remove Question
                                        </Button>
                                    </div>
                                ))}

                                <Button variant="secondary" className="mt-3" onClick={handleAddQuestion}>
                                    Add Question
                                </Button>
                            </>
                        )}


                        <Button variant="primary" type="submit" className="mt-3">
                            Save PPT
                        </Button>
                    </Form>


                </div>
            </div>
        </div>
    );
};

export default PPTPage;
