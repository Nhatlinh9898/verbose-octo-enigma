import React from 'react';
import { ArrowLeft } from 'lucide-react';
import UploadComponent from '../components/UploadComponent';

interface UploadPageProps {
  onBack?: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Quay lại</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            Upload Center
          </h1>
        </div>
        <UploadComponent />
      </div>
    </div>
  );
};

export default UploadPage;
