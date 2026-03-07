import { IUser } from "../../domain/IUser.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";

export class GetUser {
  constructor(private userRepository: IUserRepository) { }

  async execute(auth0Id: string): Promise<IUser | null> {
    return this.userRepository.findByAuth0Id(auth0Id);
  }
}
