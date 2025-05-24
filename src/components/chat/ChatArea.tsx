
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserProfile, Message } from '@/types/chat';
import { Hash, Users, Bell, Search, Pin, MoreVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatAreaProps {
  currentUser: UserProfile;
  selectedChannel: string;
  sidebarCollapsed: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentUser,
  selectedChannel,
  sidebarCollapsed,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock initial messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Welcome to the chat! 🎉',
        senderId: 'system',
        senderUsername: 'System',
        timestamp: new Date(Date.now() - 3600000),
        channel: selectedChannel,
        type: 'system',
      },
      {
        id: '2',
        content: 'Hey everyone! How is the hackathon going?',
        senderId: 'alice',
        senderUsername: 'alice_dev',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        timestamp: new Date(Date.now() - 1800000),
        channel: selectedChannel,
        type: 'text',
        reactions: [{ emoji: '👍', users: ['bob', 'charlie'] }],
      },
      {
        id: '3',
        content: 'Pretty good! Working on the chat features right now 💻',
        senderId: 'bob',
        senderUsername: 'bob_designer',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        timestamp: new Date(Date.now() - 1200000),
        channel: selectedChannel,
        type: 'text',
      },
      {
        id: '4',
        content: 'This AI integration is going to be amazing! 🚀',
        senderId: 'charlie',
        senderUsername: 'charlie_pm',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
        timestamp: new Date(Date.now() - 600000),
        channel: selectedChannel,
        type: 'text',
        reactions: [{ emoji: '🔥', users: ['alice', 'bob', 'diana'] }],
      },
    ];
    setMessages(mockMessages);
  }, [selectedChannel]);

  const handleSendMessage = async (content: string, type: 'text' | 'file' = 'text', fileUrl?: string, fileName?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      channel: selectedChannel,
      type,
      fileUrl,
      fileName,
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response for demonstration
    if (content.toLowerCase().includes('ai') || content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm an AI assistant! I can help you with:\n• Smart message suggestions\n• Code formatting\n• Language translation\n• Quick responses\n\nWhat would you like assistance with?",
          senderId: 'ai-assistant',
          senderUsername: 'AI Assistant',
          senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
          timestamp: new Date(),
          channel: selectedChannel,
          type: 'text',
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Remove reaction
            existingReaction.users = existingReaction.users.filter(u => u !== currentUser.id);
            if (existingReaction.users.length === 0) {
              return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
            }
          } else {
            // Add reaction
            existingReaction.users.push(currentUser.id);
          }
        } else {
          // New reaction
          reactions.push({ emoji, users: [currentUser.id] });
        }
        
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/30 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/30">
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 text-gray-400" />
          <div>
            <h2 className="font-semibold text-white capitalize">#{selectedChannel}</h2>
            <p className="text-xs text-gray-400">42 members</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Pin className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          onReaction={handleReaction}
        />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
        selectedChannel={selectedChannel}
      />
    </div>
  );
};
