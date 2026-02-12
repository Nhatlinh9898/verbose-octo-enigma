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

    // Mock KOL data for testing without Gemini API
    const kolProfile = {
      name: `KOL ${industry.charAt(0).toUpperCase() + industry.slice(1)}`,
      bio: `Chuyên gia hàng đầu trong lĩnh vực ${industry} với nhiều năm kinh nghiệm. Đam mê chia sẻ kiến thức và xây dựng cộng đồng.`,
      personality: ["Sáng tạo", "Đam mê", "Chuyên nghiệp", "Thân thiện", "Có ảnh hưởng"],
      contentStyle: "Chuyên nghiệp nhưng gần gũi, dễ hiểu và truyền cảm hứng",
      goals: `Trở thành người dẫn đầu trong ngành ${industry} và xây dựng cộng đồng vững mạnh`,
      platforms: ["Instagram", "TikTok", "YouTube", "Facebook"]
    };

    res.json(kolProfile);
  } catch (error) {
    console.error('KOL Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating KOL profile',
      error: error.message 
    });
  }
};
