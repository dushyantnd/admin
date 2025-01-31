import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import AdminSidebar from "../../../components/AdminSidebar";
import { useRouter } from 'next/router';

const EditSlide = () => {
    const router = useRouter();
    const { id } = router.query; // Assuming the slide ID is passed as a query parameter
    const [headerTitle, setHeaderTitle] = useState('');
    const [headerLogo, setHeaderLogo] = useState('');
    const [footerText, setFooterText] = useState('');
    const [footerLogo, setFooterLogo] = useState('');
    const [textEntries, setTextEntries] = useState([]);
    const [hintLine, setHintLine] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch the existing slide data
    const fetchSlideData = async () => {
        try {
            const res = await fetch(`/api/ppt?id=${id}`); // Replace with the correct endpoint
            if (!res.ok) throw new Error('Failed to fetch slide data');
            const data = await res.json();

            // Populate state with fetched data
            setHeaderTitle(data.header.title);
            setHeaderLogo(data.header.logo);
            setFooterText(data.footer.text);
            setFooterLogo(data.footer.logo);
            setTextEntries(data.textEntries);
            setHintLine(data.hintLine || '');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchSlideData();
    }, [id]);

    const addSlide = () => {
        setTextEntries([...textEntries, { entries: [{ title: '', description: '' }] }]);
    };

    const addTextEntry = (slideIndex) => {
        setTextEntries(
            textEntries.map((slide, index) =>
                index === slideIndex
                    ? { ...slide, entries: [...slide.entries, { title: '', description: '' }] }
                    : slide
            )
        );
    };

    const removeTextEntry = (slideIndex, entryIndex) => {
        setTextEntries(
            textEntries.map((slide, index) =>
                index === slideIndex
                    ? { ...slide, entries: slide.entries.filter((_, idx) => idx !== entryIndex) }
                    : slide
            )
        );
    };

    const removeSlide = (slideIndex) => {
        if (textEntries.length > 1) {
            setTextEntries(textEntries.filter((_, index) => index !== slideIndex));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            type: 'type_one',
            header: { title: headerTitle, logo: headerLogo },
            footer: { text: footerText, logo: footerLogo },
            textEntries: textEntries.map((slide) => ({
                entries: slide.entries.map((entry) => ({
                    title: entry.title.trim(),
                    description: entry.description.trim(),
                })),
            })),
            hintLine: hintLine.trim(),
        };

        try {
            const res = await fetch(`/api/ppt?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('PPT updated successfully');
                router.push("/us/ppt/list");
            } else {
                alert('Error updating PPT');
            }
        } catch (err) {
            alert('Error saving changes');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Edit PPT</h4>
                    </div>
                    <Form className="p-4 row" onSubmit={handleSubmit}>
                        <Form.Group className="col-md-6">
                            <Form.Label>Header Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerTitle}
                                onChange={(e) => setHeaderTitle(e.target.value)}
                                placeholder="Header Title"
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Form.Label>Footer Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                placeholder="Footer Text"
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Form.Label>Header Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={headerLogo}
                                onChange={(e) => setHeaderLogo(e.target.value)}
                                placeholder="Header Logo URL"
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Form.Label>Footer Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={footerLogo}
                                onChange={(e) => setFooterLogo(e.target.value)}
                                placeholder="Footer Logo URL"
                            />
                        </Form.Group>

                        <h4>Slides</h4>
                        {textEntries.map((slide, slideIndex) => (
                            <div key={slideIndex} className="mb-4 border rounded p-3">
                                <h5>Slide {slideIndex + 1} </h5>
                                {slide.entries.map((entry, entryIndex) => (
                                    <div key={entryIndex} className="mb-3 row">
                                        <Form.Group className="col-md-5">
                                            <Form.Control
                                                type="text"
                                                placeholder={`Title for Slide ${slideIndex + 1}`}
                                                value={entry.title || ''}
                                                onChange={(en) =>
                                                    setTextEntries(
                                                        textEntries.map((s, i) =>
                                                            i === slideIndex
                                                                ? {
                                                                    ...s,
                                                                    entries: s.entries.map((e, j) =>
                                                                        j === entryIndex
                                                                            ? { ...e, title: en.target.value }
                                                                            : e
                                                                    ),
                                                                }
                                                                : s
                                                        )
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-6">
                                            <Form.Control
                                                type="text"
                                                placeholder={`Description for Slide ${slideIndex + 1}`}
                                                value={entry.description || ''}
                                                onChange={(en) =>
                                                    setTextEntries(
                                                        textEntries.map((s, i) =>
                                                            i === slideIndex
                                                                ? {
                                                                    ...s,
                                                                    entries: s.entries.map((e, j) =>
                                                                        j === entryIndex
                                                                            ? { ...e, description: en.target.value }
                                                                            : e
                                                                    ),
                                                                }
                                                                : s
                                                        )
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                        <div className="col-md-1 d-flex align-items-end">
                                            <Button
                                                variant="danger"
                                                size='sm'
                                                onClick={() => removeTextEntry(slideIndex, entryIndex)}
                                                title='Remove Entry'
                                            >
                                                <i class="bi bi-node-minus"></i>
                                            </Button>&nbsp;
                                            {entryIndex == (slide.entries.length - 1) && <Button
                                                variant="success"
                                                onClick={() => addTextEntry(slideIndex)}
                                                size='sm'
                                                title='Add Text Entry'
                                            >
                                                <i class="bi bi-node-plus"></i>
                                            </Button>}
                                        </div>
                                    </div>
                                ))}

                                <div className="text-start">
                                    <Button
                                        variant="danger"
                                        size='sm'
                                        onClick={() => removeSlide(slideIndex)}
                                        disabled={textEntries.length === 1}
                                        title='Remove Slide'
                                    >
                                        <i class="bi bi-file-minus"></i>
                                    </Button>&nbsp;
                                    <Button
                                        variant="primary"
                                        onClick={addSlide}
                                        size='sm'
                                        title='Add Slide'
                                    >

                                        <i class="bi bi-file-plus"></i>
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Form.Group className="mt-3">
                            <Form.Label>Hint Line</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter hint line"
                                value={hintLine}
                                onChange={(e) => setHintLine(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-3 col-md-2">
                            Update Changes
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditSlide;
