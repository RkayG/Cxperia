export interface Message {
  id: string;
  subject: string;
  sender: {
    name: string;
    avatar: string; // URL to sender's avatar
  };
  preview: string;
  time: string; // e.g., "3 minutes ago", "1 hour ago"
  read: boolean;
  rating?: number; // 1-5, optional, for UI rating display
  images?: string[]; // Optional array of image URLs attached to feedback
  productName?: string; // Product name for filtering
  experienceId?: string; // Experience ID for reference
}

export interface InboxHeaderProps {
  onSearch: (query: string) => void;
}

export interface MessageListItemProps {
  message: Message;
  onSelectMessage: (id: string) => void;
}

export interface MessageListProps {
  messages: Message[];
  onSelectMessage: (id: string) => void;
}
