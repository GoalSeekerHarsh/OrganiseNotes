
import React from 'react';

interface ChatbotToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const ChatbotToggleButton: React.FC<ChatbotToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:right-8 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 z-50 transition-all duration-300 ease-in-out hover:scale-110"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <div className="transition-transform duration-300 ease-in-out" style={{ transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg)' }}>
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </div>
    </button>
  );
};

export default ChatbotToggleButton;