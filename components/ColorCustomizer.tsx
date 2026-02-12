import React, { useState, useEffect } from 'react';
import { Palette, Eye, EyeOff, RefreshCw, Check, Contrast } from 'lucide-react';

interface ColorCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyColors: (backgroundColor: string, textColor: string) => void;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ 
  isOpen, 
  onClose, 
  onApplyColors 
}) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showPreview, setShowPreview] = useState(true);
  
  // High contrast presets
  const highContrastPresets = [
    { bg: '#000000', text: '#ffffff', name: 'Đen-Trắng (Tối đa)' },
    { bg: '#ffffff', text: '#000000', name: 'Trắng-Đen (Tối đa)' },
    { bg: '#1a1a1a', text: '#ffff00', name: 'Đen-Vàng (WCAG AAA)' },
    { bg: '#000080', text: '#ffffff', name: 'Xương hàm-Trắng' },
    { bg: '#ffffff', text: '#ff0000', name: 'Trắng-Đỏ' },
    { bg: '#000000', text: '#00ff00', name: 'Đen-Xanh lá' },
    { bg: '#ffffff', text: '#0000ff', name: 'Trắng-Xanh dương' },
    { bg: '#800080', text: '#ffffff', name: 'Tím-Trắng' },
  ];

  // Calculate contrast ratio
  const calculateContrast = (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
      
      return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = calculateContrast(backgroundColor, textColor);
  
  // WCAG compliance levels
  const getWCAGLevel = (ratio: number): { level: string; color: string } => {
    if (ratio >= 7) return { level: 'AAA (Tối ưu)', color: 'text-green-600' };
    if (ratio >= 4.5) return { level: 'AA (Tốt)', color: 'text-blue-600' };
    if (ratio >= 3) return { level: 'AA Large (Trung bình)', color: 'text-yellow-600' };
    return { level: 'Chưa đạt chuẩn', color: 'text-red-600' };
  };

  const wcagInfo = getWCAGLevel(contrastRatio);

  const handlePresetClick = (preset: typeof highContrastPresets[0]) => {
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
  };

  const handleApply = () => {
    onApplyColors(backgroundColor, textColor);
    onClose();
  };

  const optimizeForContrast = () => {
    // Auto-optimize for maximum contrast
    if (backgroundColor === '#000000') {
      setTextColor('#ffffff');
    } else if (backgroundColor === '#ffffff') {
      setTextColor('#000000');
    } else {
      // Calculate best contrasting color
      const bgLum = calculateContrast(backgroundColor, '#ffffff');
      const textLum = calculateContrast(backgroundColor, '#000000');
      setTextColor(bgLum > textLum ? '#ffffff' : '#000000');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette size={24} />
              <h2 className="text-2xl font-bold">Tùy chỉnh Độ tương phản</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-blue-100">Chỉnh sửa màu nền và màu chữ để đạt độ tương phản cao nhất</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Contrast Indicator */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Contrast size={20} className="text-gray-600" />
                <div>
                  <p className="font-semibold">Tỷ lệ tương phản</p>
                  <p className="text-sm text-gray-600">Hiện tại: {contrastRatio.toFixed(2)}:1</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${wcagInfo.color}`}>{wcagInfo.level}</p>
                <p className="text-xs text-gray-500">Tiêu chuẩn WCAG 2.1</p>
              </div>
            </div>
          </div>

          {/* Color Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Màu nền
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-20 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 outline-none"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Màu chữ
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-20 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 outline-none"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">Xem trước</label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            {showPreview && (
              <div 
                className="rounded-xl p-6 border-2 border-gray-300"
                style={{ backgroundColor, color: textColor }}
              >
                <h3 className="text-xl font-bold mb-2">Văn bản mẫu Tiêu đề</h3>
                <p className="mb-3">Đây là đoạn văn bản mẫu để kiểm tra độ tương phản giữa màu nền và màu chữ. Bạn có thể đọc dễ dàng không?</p>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 rounded border font-medium"
                    style={{ 
                      backgroundColor: textColor, 
                      color: backgroundColor,
                      borderColor: textColor 
                    }}
                  >
                    Nút bấm
                  </button>
                  <a href="#" className="underline font-medium">Liên kết mẫu</a>
                </div>
              </div>
            )}
          </div>

          {/* High Contrast Presets */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Màu tương phản cao nhất</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {highContrastPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset)}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: preset.text }}
                    />
                  </div>
                  <p className="text-xs font-medium">{preset.name}</p>
                  <p className="text-xs text-gray-500">
                    {calculateContrast(preset.bg, preset.text).toFixed(1)}:1
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={optimizeForContrast}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Tối ưu tương phản
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCustomizer;
