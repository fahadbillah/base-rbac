export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface IUser {
  id: string;
  email: string;
  auth0Id: string;
  role: UserRole;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
