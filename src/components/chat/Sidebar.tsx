
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Hash, 
  Plus, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Bell,
  Search,
  Crown,
  Shield
} from 'lucide-react';
import { UserProfile, Channel } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentUser: UserProfile;
  selectedChannel: string;
  onChannelSelect: (channelId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const mockChannels: Channel[] = [
  { id: 'general', name: 'general', type: 'text', memberCount: 42, unreadCount: 3 },
  { id: 'random', name: 'random', type: 'text', memberCount: 28, unreadCount: 0 },
  { id: 'tech-talk', name: 'tech-talk', type: 'text', memberCount: 15, unreadCount: 1 },
  { id: 'announcements', name: 'announcements', type: 'text', memberCount: 50, unreadCount: 0 },
];

const mockUsers: UserProfile[] = [
  { id: '1', username: 'alice_dev', email: 'alice@example.com', status: 'online', role: 'admin' },
  { id: '2', username: 'bob_designer', email: 'bob@example.com', status: 'away', role: 'moderator' },
  { id: '3', username: 'charlie_pm', email: 'charlie@example.com', status: 'busy', role: 'user' },
  { id: '4', username: 'diana_qa', email: 'diana@example.com', status: 'online', role: 'user' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  selectedChannel,
  onChannelSelect,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const [showUsers, setShowUsers] = useState(true);

  const getStatusColor = (status: UserProfile['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'moderator': return <Shield className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "bg-slate-800/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ChatFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Channels Section */}
        <div className="p-4">
          {!collapsed && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Channels
              </span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-white">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <div className="space-y-1">
            {mockChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                onClick={() => onChannelSelect(channel.id)}
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-white/10",
                  selectedChannel === channel.id && "bg-purple-500/20 text-purple-200",
                  collapsed && "justify-center px-2"
                )}
              >
                <Hash className={cn("w-4 h-4", !collapsed && "mr-2")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{channel.name}</span>
                    {channel.unreadCount! > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Users Section */}
        {!collapsed && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Online - {mockUsers.filter(u => u.status === 'online').length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUsers(!showUsers)}
                className="h-5 w-5 p-0 text-gray-400 hover:text-white"
              >
                <Users className="w-3 h-3" />
              </Button>
            </div>
            
            {showUsers && (
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-tr from-purple-400 to-pink-400">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800",
                        getStatusColor(user.status)
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-300 truncate">
                          {user.username}
                        </span>
                        {getRoleIcon(user.role)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* User Panel */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-gradient-to-tr from-purple-400 to-pink-400 text-white">
                {currentUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800",
              getStatusColor(currentUser.status)
            )} />
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-white truncate">
                  {currentUser.username}
                </span>
                {getRoleIcon(currentUser.role)}
              </div>
              <span className="text-xs text-gray-400 capitalize">
                {currentUser.status}
              </span>
            </div>
          )}
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Settings className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
