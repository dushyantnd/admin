import multer from 'multer';
import dbConnect from '../../utils/dbConnect';
import File from '../../models/File';
import cloudinary from '../../lib/cloudinary';
import { Readable } from 'stream';

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to handle multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    // Handle file upload
    try {
      await runMiddleware(req, res, upload.single('file'));

      const { fileName } = req.body; // Optional for updates
      const { buffer, originalname } = req.file;

      let fileRecord;

      // Check if the file already exists for update
      if (fileName) {
        fileRecord = await File.findOne({ fileName });
        if (!fileRecord) {
          return res.status(404).json({ error: 'File not found for update' });
        }

        // Delete the existing file in Cloudinary
        await cloudinary.uploader.destroy(fileRecord.cloudinaryId);
      }

      // Upload the file to Cloudinary
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'uploads' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // Convert buffer to readable stream
        const readable = new Readable();
        readable._read = () => {};
        readable.push(buffer);
        readable.push(null);

        readable.pipe(uploadStream);
      });

      if (fileRecord) {
        // Update the existing file record
        fileRecord.cloudinaryId = cloudinaryResponse.public_id;
        fileRecord.url = cloudinaryResponse.secure_url;
        fileRecord.uploadedAt = new Date();
        await fileRecord.save();
      } else {
        // Create a new file record
        await File.create({
          fileName: originalname,
          cloudinaryId: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        });
      }

      res.status(200).json({ message: 'File uploaded/updated successfully', url: cloudinaryResponse.secure_url });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  } else if (req.method === 'GET') {
    // Handle file listing
    try {
      const files = await File.find().sort({ uploadedAt: -1 });
      res.status(200).json({ files });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for multer
  },
};
