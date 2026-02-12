const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const createUploadDirs = () => {
  const dirs = [
    'uploads/3d-models/avatars',
    'uploads/3d-models/kol',
    'uploads/3d-models/public',
    'uploads/thumbnails',
    'uploads/textures'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createUploadDirs();
    
    const { type, userId } = req.body;
    let uploadPath = 'uploads/3d-models/public';
    
    if (type === 'avatar' && userId) {
      uploadPath = `uploads/3d-models/avatars/${userId}`;
    } else if (type === 'kol' && userId) {
      uploadPath = `uploads/3d-models/kol/${userId}`;
    }
    
    const fullPath = path.join(__dirname, '..', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter cho file 3D
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.fbx', '.glb', '.gltf', '.obj', '.dae'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only 3D model files are allowed.'), false);
  }
};

// Upload middleware
const upload3DModel = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Upload thumbnail
const uploadThumbnail = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads/thumbnails');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'thumb-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPG, PNG, WebP are allowed.'), false);
    }
  }
});

module.exports = {
  upload3DModel,
  uploadThumbnail,
  createUploadDirs
};
