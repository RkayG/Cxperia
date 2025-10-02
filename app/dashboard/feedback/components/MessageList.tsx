import React from 'react';
import MessageListItem from './MessageListItem';
import type { MessageListProps } from './inboxTypes';

const MessageList: React.FC<MessageListProps> = ({ messages, onSelectMessage }) => {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No messages in your inbox.</p>
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