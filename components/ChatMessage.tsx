
import React from 'react';
import type { ChatMessage, GroundingChunk } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

// A simple utility to render markdown-like text (bold, links)
const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    // This is a very basic renderer. A real app might use a library like 'react-markdown'.
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={index}>{part.slice(1, -1)}</em>;
                }
                 if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={index} className="bg-gray-100 dark:bg-gray-600 px-1 rounded text-sm">{part.slice(1, -1)}</code>;
                }
                return <span key={index}>{part}</span>;
            })}
        </>
    );
};


const GroundingSources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
      <h4 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Sources:</h4>
      <ol className="list-decimal list-inside space-y-1">
        {sources.map((source, index) => {
          const info = source.web || source.maps;
          if (!info || !info.uri) return null;
          return (
            <li key={index} className="text-xs">
              <a
                href={info.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline break-words"
              >
                {info.title || info.uri}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-sm md:max-w-md ${
          isModel
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            : 'bg-indigo-600 text-white'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2">
            <SimpleMarkdownRenderer text={message.text} />
        </div>
        {isModel && message.sources && <GroundingSources sources={message.sources} />}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
