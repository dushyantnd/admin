const mongoose = require('mongoose');

const newsCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    post_counts: { type: Number, },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NewsCategory', default: null },
    status: { type: String, enum: ['published', 'draft', 'pending'], default: 'draft' },
    menu: { type: String, enum: ['0', '1', '2'], default: '0' }, // 0 for no menu , 1 for top menu , 2 for other menu
    meta_title: { type: String },
    meta_desc: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NewsCategory', newsCategorySchema);
