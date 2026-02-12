# Hướng Dẫn Sử Dụng File 3D cho KOL và Avatar

## 📁 Cấu Trúc Thư Mục

```
server/
├── uploads/
│   ├── 3d-models/
│   │   ├── avatars/          # Avatar 3D files
│   │   │   ├── user_id_1/
│   │   │   │   ├── model.fbx
│   │   │   │   ├── textures/
│   │   │   │   └── animations/
│   │   │   └── user_id_2/
│   │   ├── kol/              # KOL 3D files
│   │   │   ├── kol_1/
│   │   │   └── kol_2/
│   │   └── public/           # Public 3D models
│   └── thumbnails/           # Preview images
```

## 🚀 API Endpoints

### 1. Upload 3D Model
```http
POST /api/avatars/upload-model
Content-Type: multipart/form-data

Body:
- model: (file) - File 3D model
- type: (string) - 'avatar' hoặc 'kol'
- userId: (string) - ID người dùng
```

### 2. Upload Thumbnail
```http
POST /api/avatars/upload-thumbnail
Content-Type: multipart/form-data

Body:
- thumbnail: (file) - Image file
```

### 3. Upload Logo
```http
POST /api/avatars/upload-logo
Content-Type: multipart/form-data

Body:
- logo: (file) - Logo image file
```

### 4. Create Avatar với 3D Model và Logo
```http
POST /api/avatars
Content-Type: application/json

{
  "name": "Tên Avatar",
  "description": "Mô tả",
  "modelId": "unique_model_id",
  "modelType": "LOCAL_FILE",
  "modelPath": "/uploads/3d-models/avatars/user_id/model.fbx",
  "modelFormat": "FBX",
  "texturePath": "/uploads/textures/texture.jpg",
  "animationPaths": {
    "idle": "/uploads/animations/idle.fbx",
    "talking": "/uploads/animations/talking.fbx",
    "greeting": "/uploads/animations/wave.fbx",
    "walking": "/uploads/animations/walking.fbx"
  },
  "thumbnail": "/uploads/thumbnails/thumb.jpg",
  "logo": "/uploads/logos/company_logo.png",
  "logoPosition": "TOP_RIGHT",
  "logoSize": "SMALL",
  "logoOpacity": 0.8,
  "category": "HUMAN",
  "personality": ["friendly", "professional"],
  "greetingMessage": "Xin chào!",
  "voiceSettings": {
    "language": "vi-VN",
    "voice": "female",
    "speed": 1.0
  },
  "environment": "studio",
  "isPublic": true
}
```

## 📋 Định Dạng File Hỗ Trợ

### 3D Models:
- **FBX** - Khuyến khích (hỗ trợ animation)
- **GLB/GLTF** - Tốt cho web
- **OBJ** - Đơn giản, không animation
- **DAE** - Collada format

### Textures:
- **JPG/PNG** - Diffuse maps
- **TGA** - High quality textures

### Thumbnails:
- **JPG/PNG/WebP** - Preview images

### Logos:
- **JPG/PNG** - Company/brand logos
- **SVG** - Vector logos (recommended)
- **WebP** - Modern web format

## 🔧 Cài Đặt

1. **Cài đặt dependencies:**
```bash
cd server
npm install multer
```

2. **Khởi động server:**
```bash
npm run dev
```

3. **Upload file 3D:**
```javascript
// Sử dụng FormData để upload 3D model
const formData = new FormData();
formData.append('model', file3D);
formData.append('type', 'avatar');
formData.append('userId', 'user123');

fetch('/api/avatars/upload-model', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

4. **Upload logo:**
```javascript
// Upload logo cho avatar
const formData = new FormData();
formData.append('logo', logoFile);

fetch('/api/avatars/upload-logo', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎯 Sử Dụng Frontend

### React Component Example:
```jsx
import React, { useState } from 'react';

const Avatar3DUpload = () => {
  const [modelFile, setModelFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleModelUpload = async (e) => {
    const file = e.target.files[0];
    setModelFile(file);
    
    const formData = new FormData();
    formData.append('model', file);
    formData.append('type', 'avatar');
    formData.append('userId', 'current_user_id');
    
    try {
      const response = await fetch('/api/avatars/upload-model', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Model uploaded:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
      const response = await fetch('/api/avatars/upload-logo', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Logo uploaded:', data);
    } catch (error) {
      console.error('Logo upload error:', error);
    }
  };

  return (
    <div>
      <h3>Upload 3D Avatar</h3>
      <input 
        type="file" 
        accept=".fbx,.glb,.gltf,.obj,.dae"
        onChange={handleModelUpload}
      />
      
      <h3>Upload Logo</h3>
      <input 
        type="file" 
        accept=".jpg,.jpeg,.png,.svg,.webp"
        onChange={handleLogoUpload}
      />
    </div>
  );
};

export default Avatar3DUpload;
```

## 📱 Three.js Integration

```javascript
// Load 3D model từ server
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const loader = new FBXLoader();
loader.load(
  '/uploads/3d-models/avatars/user_id/model.fbx',
  (object) => {
    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);
```

## ⚠️ Lưu Ý Quan Trọng

1. **File size limit:** 50MB cho 3D models
2. **Thumbnail limit:** 5MB
3. **Authentication:** Cần enable lại middleware auth
4. **Validation:** Kiểm tra file format trước khi upload
5. **Security:** Validate file content để tránh malicious files

## 🔍 Debug Tips

- Kiểm tra console log cho upload progress
- Verify file paths trong database
- Test với different 3D formats
- Check CORS settings cho file access
- Monitor server logs cho errors

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra file format
2. Verify server logs
3. Test với small file first
4. Check network connectivity
5. Validate API endpoints
