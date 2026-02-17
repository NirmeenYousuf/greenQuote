export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export enum UserType {
  admin = 'admin',
  user = 'user'
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  userType: UserType;
}

export type LoginResponse = AuthUser;
