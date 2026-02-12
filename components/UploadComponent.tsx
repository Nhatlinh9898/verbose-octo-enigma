import React, { useState } from 'react';

interface UploadResponse {
  message: string;
  filename: string;
  originalName: string;
  size: number;
  path: string;
  fullPath: string;
}

const UploadComponent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'model' | 'thumbnail' | 'logo'>('model');
  const [userId, setUserId] = useState('user123');
  const [modelType, setModelType] = useState<'avatar' | 'kol' | 'public'>('public');
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('model', file);
    formData.append('userId', userId);
    formData.append('type', modelType);

    try {
      let endpoint = '';
      let fieldName = '';

      switch (uploadType) {
        case 'model':
          endpoint = 'http://localhost:5000/api/avatars/upload-model';
          fieldName = 'model';
          break;
        case 'thumbnail':
          endpoint = 'http://localhost:5000/api/avatars/upload-thumbnail';
          fieldName = 'thumbnail';
          formData.delete('model');
          formData.delete('type');
          formData.append(fieldName, file);
          break;
        case 'logo':
          endpoint = 'http://localhost:5000/api/avatars/upload-logo';
          fieldName = 'logo';
          formData.delete('model');
          formData.delete('type');
          formData.append(fieldName, file);
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result: UploadResponse = await response.json();
      setUploadResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getFileTypes = () => {
    switch (uploadType) {
      case 'model':
        return '.fbx,.glb,.gltf,.obj,.dae';
      case 'thumbnail':
        return '.jpg,.jpeg,.png,.webp';
      case 'logo':
        return '.jpg,.jpeg,.png,.svg,.webp';
      default:
        return '*';
    }
  };

  const getMaxFileSize = () => {
    switch (uploadType) {
      case 'model':
        return '50MB';
      case 'thumbnail':
        return '5MB';
      case 'logo':
        return '2MB';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Files</h2>
      
      {/* Upload Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Type
        </label>
        <select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value as 'model' | 'thumbnail' | 'logo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="model">3D Model</option>
          <option value="thumbnail">Thumbnail</option>
          <option value="logo">Logo</option>
        </select>
      </div>

      {/* Additional options for 3D models */}
      {uploadType === 'model' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as 'avatar' | 'kol' | 'public')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="avatar">Avatar</option>
              <option value="kol">KOL</option>
            </select>
          </div>
        </>
      )}

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>
        <input
          type="file"
          accept={getFileTypes()}
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Max file size: {getMaxFileSize()}
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        disabled={uploading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-semibold mb-2">Upload Successful!</h3>
          <div className="text-sm space-y-1">
            <p><strong>Message:</strong> {uploadResult.message}</p>
            <p><strong>Filename:</strong> {uploadResult.filename}</p>
            <p><strong>Original Name:</strong> {uploadResult.originalName}</p>
            <p><strong>Size:</strong> {(uploadResult.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Path:</strong> {uploadResult.path}</p>
            <p><strong>Full Path:</strong> {uploadResult.fullPath}</p>
          </div>
          
          {/* Preview for images */}
          {(uploadType === 'thumbnail' || uploadType === 'logo') && (
            <div className="mt-3">
              <p className="font-semibold mb-1">Preview:</p>
              <img 
                src={`http://localhost:5000${uploadResult.path}`}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      )}

      {/* File Type Information */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Supported File Types:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>3D Models:</strong> .fbx, .glb, .gltf, .obj, .dae (max 50MB)</li>
          <li><strong>Thumbnails:</strong> .jpg, .jpeg, .png, .webp (max 5MB)</li>
          <li><strong>Logos:</strong> .jpg, .jpeg, .png, .svg, .webp (max 2MB)</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadComponent;
