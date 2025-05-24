
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './MessageItem';
import { Message, UserProfile } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  currentUser: UserProfile;
  onReaction: (messageId: string, emoji: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  onReaction,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = messages.reduce((groups: Message[][], message, index) => {
    const prevMessage = messages[index - 1];
    const shouldGroup = prevMessage && 
      prevMessage.senderId === message.senderId &&
      prevMessage.type === 'text' &&
      message.type === 'text' &&
      (message.timestamp.getTime() - prevMessage.timestamp.getTime()) < 300000; // 5 minutes

    if (shouldGroup) {
      groups[groups.length - 1].push(message);
    } else {
      groups.push([message]);
    }

    return groups;
  }, []);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {group.map((message, messageIndex) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUser={currentUser}
                isFirst={messageIndex === 0}
                onReaction={onReaction}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
