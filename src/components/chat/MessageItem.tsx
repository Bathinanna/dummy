
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Message, UserProfile } from '@/types/chat';
import { MoreVertical, Reply, Edit, Trash, Copy, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
  currentUser: UserProfile;
  isFirst: boolean;
  onReaction: (messageId: string, emoji: string) => void;
}

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  isFirst,
  onReaction,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isOwnMessage = message.senderId === currentUser.id;
  const isSystemMessage = message.type === 'system';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  return (
    <div
      className={cn(
        "group relative hover:bg-white/5 px-4 py-1 rounded-lg transition-colors",
        isFirst && "pt-3"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex space-x-3">
        {isFirst ? (
          <Avatar className="h-8 w-8 mt-0.5">
            <AvatarImage src={message.senderAvatar} />
            <AvatarFallback className="bg-gradient-to-tr from-purple-400 to-pink-400 text-white text-xs">
              {message.senderUsername.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 flex justify-center">
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isFirst && (
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="font-semibold text-white">
                {message.senderUsername}
              </span>
              <span className="text-xs text-gray-500">
                {format(message.timestamp, 'MMM dd, HH:mm')}
              </span>
              {message.edited && (
                <span className="text-xs text-gray-500">(edited)</span>
              )}
            </div>
          )}

          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => onReaction(message.id, reaction.emoji)}
                  className={cn(
                    "h-6 px-2 text-xs bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600",
                    reaction.users.includes(currentUser.id) && "bg-purple-500/20 border-purple-400/50"
                  )}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.users.length}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Actions */}
      {showActions && (
        <div className="absolute top-0 right-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {commonEmojis.slice(0, 3).map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => onReaction(message.id, emoji)}
                className="h-7 w-7 p-0 hover:bg-slate-700"
              >
                {emoji}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-7 w-7 p-0 hover:bg-slate-700"
            >
              ➕
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-slate-700"
            >
              <Reply className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-slate-700"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute top-8 right-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-4 gap-1">
            {commonEmojis.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onReaction(message.id, emoji);
                  setShowEmojiPicker(false);
                }}
                className="h-8 w-8 p-0 hover:bg-slate-700"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
