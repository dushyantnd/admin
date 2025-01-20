import dbConnect from '../../../utils/dbConnect';
import File from '../../../models/File';
import cloudinary from '../../../lib/cloudinary';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await dbConnect();

    try {
      // Find the file in the database
      const file = await File.findById(id);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Delete the file from Cloudinary
      await cloudinary.uploader.destroy(file.cloudinaryId);

      // Delete the file record from MongoDB
      await File.findByIdAndDelete(id);

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
