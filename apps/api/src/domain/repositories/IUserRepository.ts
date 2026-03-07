import { IUser } from "../IUser";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByAuth0Id(auth0Id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}
