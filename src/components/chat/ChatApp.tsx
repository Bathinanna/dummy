
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { AuthModal } from './AuthModal';
import { UserProfile } from '@/types/chat';
import { toast } from '@/hooks/use-toast';

export const ChatApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Simulate user authentication check
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('chatUser', JSON.stringify(user));
    toast({
      title: "Welcome back!",
      description: `Logged in as ${user.username}`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('chatUser');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  if (!currentUser) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
      
      <Sidebar
        currentUser={currentUser}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />
      
      <ChatArea
        currentUser={currentUser}
        selectedChannel={selectedChannel}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
};
