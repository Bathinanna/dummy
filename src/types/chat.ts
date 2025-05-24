
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'admin' | 'moderator' | 'user';
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderUsername: string;
  senderAvatar?: string;
  timestamp: Date;
  channel: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'voice' | 'private';
  memberCount: number;
  unreadCount?: number;
  lastMessage?: Message;
}

export interface ChatState {
  messages: Message[];
  users: UserProfile[];
  channels: Channel[];
  currentUser: UserProfile | null;
  selectedChannel: string;
  isConnected: boolean;
}
