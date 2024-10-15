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
  avatarUrl: string;
  chatName: string;
  messages: Message[];
  readStatus: [{ userId: string; read: boolean }];
  participants: string[];
  isGroupChat: boolean;
};

export type Attachment = {
  attachmentId: string;
  type: string;
  url: string;
};
