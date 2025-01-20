import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { file } = req.body;

    try {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: 'us/blog', 
      });

      res.status(200).json({ success: true, data: uploadResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to upload image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
