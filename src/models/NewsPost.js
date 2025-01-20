const mongoose = require('mongoose');

const newsPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    short_desc: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    author_name: { type: String },
    category_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'NewsCategory', default: null },
    status: { type: String, enum: ['published', 'draft', 'pending'], default: 'draft' },
    featured_image: { type: String },
    view_count: { type: Number, default: 0 },
    share_count: { type: Number, default: 0 },
    meta_title: { type: String },
    meta_desc: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NewsPost', newsPostSchema);
