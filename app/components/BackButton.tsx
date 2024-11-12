import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton: React.FC = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBackClick}
      className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
    >
      <FaArrowLeft size={30} />
    </button>
  );
};

export default BackButton;
