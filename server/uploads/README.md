# Uploads Directory

## 📁 Cấu trúc thư mục

```
uploads/
├── 3d-models/
│   ├── avatars/          # Avatar 3D files cho từng user
│   │   └── [user_id]/
│   │       ├── model.fbx
│   │       ├── textures/
│   │       └── animations/
│   ├── kol/              # KOL 3D files
│   │   └── [kol_id]/
│   └── public/           # Public 3D models
├── thumbnails/           # Preview images
└── textures/            # Texture files
```

## 📝 Hướng dẫn sử dụng

1. **Upload 3D model:** Sử dụng API endpoint `/api/avatars/upload-model`
2. **Upload thumbnail:** Sử dụng API endpoint `/api/avatars/upload-thumbnail`
3. **Truy cập file:** Qua URL `/uploads/[path]`

## 🔧 File formats hỗ trợ

- **3D Models:** .fbx, .glb, .gltf, .obj, .dae
- **Images:** .jpg, .jpeg, .png, .webp
- **Textures:** .jpg, .png, .tga

## ⚠️ Lưu ý

- File size limit: 50MB cho 3D models
- File size limit: 5MB cho thumbnails
- Tự động tạo thư mục theo user ID khi upload
