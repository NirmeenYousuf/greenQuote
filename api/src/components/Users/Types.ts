export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  userType: UserType;
  createdAt: Date;
}

export enum UserType {
  admin = 'admin',
  user = 'user',
}
