export type Message = {
  messageId: string;
  userId: string;
  senderId: string;
  message: string;
  timestamp: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  editRecents?: [{ timestamp: string; message: string }?];
  attachments?: Attachment[];
};

export type Chat = {
  chatId: string;
  userId: string;
  messages: Message[];
};

export type Attachment = {
  attachmentId: string;
  type: string;
  url: string;
};

export type GroupChat = {
  chatId: string;
  userId: string;
  messages: Message[];
  participants: string[];
  ModeratorId: string[];
  attachments: Attachment[];
};

export type Chats = {
  chatId: string;
  username: string;
  imageUri: string;
  lastMessage: string;
  isMe: boolean;
  isRead: boolean;
};
