
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/types/chat';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Gift, 
  Plus,
  Image,
  File,
  Code,
  AtSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'file', fileUrl?: string, fileName?: string) => void;
  currentUser: UserProfile;
  selectedChannel: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  currentUser,
  selectedChannel,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
      const fileUrl = URL.createObjectURL(file);
      onSendMessage(`Uploaded: ${file.name}`, 'file', fileUrl, file.name);
      toast({
        title: "File uploaded",
        description: `${file.name} has been shared`,
      });
    }
  };

  const insertQuickText = (text: string) => {
    setMessage(prev => prev + text);
    inputRef.current?.focus();
  };

  const quickResponses = [
    "👍 Sounds good!",
    "🎉 Great work!",
    "🤔 Let me think about that",
    "⏰ I'll get back to you soon",
    "✅ Done!",
    "❌ Not quite right",
  ];

  return (
    <div className="border-t border-white/10 bg-slate-800/30 backdrop-blur-sm">
      {/* Quick Responses */}
      <div className="px-4 py-2 border-b border-white/5">
        <div className="flex flex-wrap gap-2">
          {quickResponses.map((response, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => insertQuickText(response)}
              className="h-6 px-2 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-gray-300"
            >
              {response}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Attachment Button */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAttachments(!showAttachments)}
              className="text-gray-400 hover:text-white"
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            {showAttachments && (
              <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-2 min-w-[160px]">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-start text-gray-300 hover:text-white"
                  >
                    <File className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-300 hover:text-white"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertQuickText('```\n\n```')}
                    className="w-full justify-start text-gray-300 hover:text-white"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Code Block
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${selectedChannel}`}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 pr-24"
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <AtSign className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <Smile className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <Gift className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Voice/Send Button */}
          {message.trim() ? (
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
              className={cn(
                "text-gray-400 hover:text-white transition-colors",
                isRecording && "text-red-400 bg-red-500/20"
              )}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </form>

        {/* Typing Indicator */}
        {isRecording && (
          <div className="mt-2 text-xs text-gray-400 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-150" />
            </div>
            <span>Recording voice message...</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="*/*"
      />
    </div>
  );
};
