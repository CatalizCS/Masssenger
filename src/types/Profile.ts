export type Profile = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  avatarUrl: string;
  lastSeen: string;
  isOnline: boolean;
  note: string;
  friends: Profile[];
};

export type Story = {
  id: string;
  imageUrl: string;
  videoUrl: string;
  postedAt: string;
  expiresAt: string;
};

export type Stories = {
  profileId: string;
  stories: Story[];
};
