export interface DataForToken {
  id: string;
}

export interface DefaultTable {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends DefaultTable {
  firstName: string;
  lastName: string;
  email: string;
  type: UserTypes;
  status: UserStatus;
  password?: string;
  profilePhoto?: string;
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Blocked = 'Blocked',
}

export enum UserTypes {
  Admin = 'Admin',
  User = 'User',
}

export interface verifyToken {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export enum s3Paths {
  profilePictures = 'profile-pictures/',
}
