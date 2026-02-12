const fs = require('fs');
const path = require('path');

// @desc    Get all available logos
// @route   GET /api/logos
exports.getLogos = async (req, res) => {
  try {
    const logosDir = path.join(__dirname, '..', 'uploads', 'logos');
    
    // Check if directory exists
    if (!fs.existsSync(logosDir)) {
      return res.status(404).json({ message: 'Logos directory not found' });
    }

    // Read all files in logos directory
    const files = fs.readdirSync(logosDir);
    
    // Filter only image files and get their stats
    const logoFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(logosDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          name: path.parse(file).name,
          extension: path.extname(file).toLowerCase(),
          size: stats.size,
          sizeFormatted: (stats.size / 1024).toFixed(2) + ' KB',
          url: `http://localhost:5000/uploads/logos/${file}`,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    res.json({
      message: 'Logos retrieved successfully',
      count: logoFiles.length,
      logos: logoFiles
    });
  } catch (error) {
    console.error('Get logos error:', error);
    res.status(500).json({ message: 'Error fetching logos' });
  }
};

// @desc    Get logo by filename
// @route   GET /api/logos/:filename
exports.getLogoByName = async (req, res) => {
  try {
    const { filename } = req.params;
    const logosDir = path.join(__dirname, '..', 'uploads', 'logos');
    const filePath = path.join(logosDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    // Validate file type
    if (!['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(ext)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    res.json({
      filename: filename,
      name: path.parse(filename).name,
      extension: ext,
      size: stats.size,
      sizeFormatted: (stats.size / 1024).toFixed(2) + ' KB',
      url: `http://localhost:5000/uploads/logos/${filename}`,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Get logo error:', error);
    res.status(500).json({ message: 'Error fetching logo' });
  }
};

// @desc    Search logos by name pattern
// @route   GET /api/logos/search/:pattern
exports.searchLogos = async (req, res) => {
  try {
    const { pattern } = req.params;
    const logosDir = path.join(__dirname, '..', 'uploads', 'logos');
    
    if (!fs.existsSync(logosDir)) {
      return res.status(404).json({ message: 'Logos directory not found' });
    }

    const files = fs.readdirSync(logosDir);
    
    // Filter files that match the pattern
    const logoFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        const isValidType = ['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(ext);
        const matchesPattern = file.toLowerCase().includes(pattern.toLowerCase());
        return isValidType && matchesPattern;
      })
      .map(file => {
        const filePath = path.join(logosDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          name: path.parse(file).name,
          extension: path.extname(file).toLowerCase(),
          size: stats.size,
          sizeFormatted: (stats.size / 1024).toFixed(2) + ' KB',
          url: `http://localhost:5000/uploads/logos/${file}`,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    res.json({
      message: `Logos matching "${pattern}" retrieved successfully`,
      pattern: pattern,
      count: logoFiles.length,
      logos: logoFiles
    });
  } catch (error) {
    console.error('Search logos error:', error);
    res.status(500).json({ message: 'Error searching logos' });
  }
};

// @desc    Get random logos
// @route   GET /api/logos/random/:count
exports.getRandomLogos = async (req, res) => {
  try {
    const { count } = req.params;
    const requestedCount = parseInt(count) || 10;
    const logosDir = path.join(__dirname, '..', 'uploads', 'logos');
    
    if (!fs.existsSync(logosDir)) {
      return res.status(404).json({ message: 'Logos directory not found' });
    }

    const files = fs.readdirSync(logosDir);
    
    // Get all valid logo files
    const allLogos = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(logosDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          name: path.parse(file).name,
          extension: path.extname(file).toLowerCase(),
          size: stats.size,
          sizeFormatted: (stats.size / 1024).toFixed(2) + ' KB',
          url: `http://localhost:5000/uploads/logos/${file}`,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });

    // Get random selection
    const shuffled = allLogos.sort(() => 0.5 - Math.random());
    const randomLogos = shuffled.slice(0, Math.min(requestedCount, allLogos.length));

    res.json({
      message: `Random logos retrieved successfully`,
      requested: requestedCount,
      returned: randomLogos.length,
      totalAvailable: allLogos.length,
      logos: randomLogos
    });
  } catch (error) {
    console.error('Get random logos error:', error);
    res.status(500).json({ message: 'Error fetching random logos' });
  }
};
