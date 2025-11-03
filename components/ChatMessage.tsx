
import React from 'react';
import type { ChatMessage, GroundingChunk } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
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
                    return <code key={index} className="bg-slate-200 dark:bg-slate-600/50 px-1 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
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
    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600/50">
      <h4 className="text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Sources:</h4>
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
                className="text-emerald-600 dark:text-emerald-400 hover:underline break-words"
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
        className={`rounded-2xl px-4 py-2 max-w-sm md:max-w-md shadow-sm ${
          isModel
            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'
            : 'bg-emerald-600 text-white rounded-br-lg'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-p:text-inherit">
            <SimpleMarkdownRenderer text={message.text} />
        </div>
        {isModel && message.sources && <GroundingSources sources={message.sources} />}
      </div>
    </div>
  );
};

export default ChatMessageComponent;