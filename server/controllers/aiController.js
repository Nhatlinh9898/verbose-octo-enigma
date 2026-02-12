const { GoogleGenerativeAI } = require('@google/genai');

// @desc    Generate AI content
// @route   POST /api/ai/generate-content
exports.generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating content',
      error: error.message 
    });
  }
};

// @desc    Generate KOL profile
// @route   POST /api/ai/generate-kol
exports.generateKOL = async (req, res) => {
  try {
    const { industry } = req.body;

    if (!industry) {
      return res.status(400).json({ message: 'Industry is required' });
    }

    const prompt = `Tạo một nhân vật KOL (Key Opinion Leader) chuyên ngành ${industry} với các thông tin sau:
    - Tên nhân vật (phải độc đáo và dễ nhớ)
    - Tiểu sử (ngắn gọn, ấn tượng)
    - Đặc tính tính cách (3-5 đặc điểm nổi bật)
    - Phong cách nội dung (phong cách nói, viết content)
    - Mục tiêu phát triển (trong 1-2 năm tới)
    - Nền tảng phù hợp (social media platforms)
    
    Trả về dạng JSON với các field: name, bio, personality, contentStyle, goals, platforms`;

    const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from response
    let kolProfile;
    try {
      kolProfile = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, return raw text
      kolProfile = {
        name: "KOL " + industry,
        bio: text,
        personality: ["Creative", "Innovative", "Engaging"],
        contentStyle: "Professional yet friendly",
        goals: "Build community and share expertise",
        platforms: ["Instagram", "TikTok", "YouTube"]
      };
    }

    res.json(kolProfile);
  } catch (error) {
    console.error('KOL Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating KOL profile',
      error: error.message 
    });
  }
};
