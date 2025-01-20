import mongoose from 'mongoose';

const pptSchema = new mongoose.Schema({
  type: { type: String, enum: ['type_one', 'type_two'], required: true }, // Type of PPT

  // Common fields for both types
  header: {
    title: { type: String, required: true },
    logo: { type: String, required: true }, // URL to logo image
  },
  footer: {
    text: { type: String, required: true },
    logo: { type: String, required: true }, // URL to logo image
  },

  // Fields specific to type_one
  textEntries: [
    {
      title: { type: String }, // Text key (e.g., भारत के विदेश मंत्री)
      description: { type: String }, // Corresponding value (e.g., डॉ. सुब्रह्मण्यम जयशंकर)
    },
  ],
  hintLine: { type: String }, // Optional hint or suggestion line

  // Fields specific to type_two
  questions: [
    {
      question: { type: String }, // Question text
      options: [{ type: String }], // Array of answer options
    },
  ],
});

export default mongoose.models.PPT || mongoose.model('PPT', pptSchema);
