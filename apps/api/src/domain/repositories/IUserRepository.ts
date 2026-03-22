// NOTE: Explicit .js extensions are required for ESM compatibility with NodeNext module resolution.
import { IUser } from "../IUser.js";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByAuth0Id(auth0Id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}
