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

export type Badge = {
  id: string;
  title: string;
  color: string;
  icon: string;
  count: number;
};
