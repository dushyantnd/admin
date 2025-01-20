import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: image }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Image uploaded successfully');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
    setUploading(false);
  };

  return (
    <div>
        <CldImage
      src="https://res.cloudinary.com/did4hiibf/image/upload/v1736626042/us/blog/krg0axgw7ysked1rgcf3.png" // Use this sample image or upload your own via the Media Explorer
      width="100"
      height="100"
      crop={{
        type: 'auto',
        source: true
      }}
    />
      <input type="file" onChange={handleFileChange} />
      {image && <img src={image} alt="Selected" style={{ width: '200px' }} />}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
