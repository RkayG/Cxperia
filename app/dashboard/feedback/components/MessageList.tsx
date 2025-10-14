import React from 'react';
import type { MessageListProps } from './inboxTypes';
import MessageListItem from './MessageListItem';

const MessageList: React.FC<MessageListProps> = ({ messages, onSelectMessage }) => {
  return (
    <div className="space-y-4">
      {/* No messages in your inbox */}
      {messages.length === 0 ? (
      
        <p className="text-center text-gray-500 py-8">Aucun message dans votre boîte de réception.</p>
      ) : (
        <div className="mb-4 grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <MessageListItem key={msg.id} message={msg} onSelectMessage={onSelectMessage} />
          ))}
        </div>
      )}
    </div>
  );
};
export default MessageList;