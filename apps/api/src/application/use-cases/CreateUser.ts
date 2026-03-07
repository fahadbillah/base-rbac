import { IUser } from "../../domain/IUser.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";

export class CreateUser {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: { email: string; auth0Id: string; name?: string }): Promise<IUser> {
    // Business logic: check if user already exists
    const existingUser = await this.userRepository.findByAuth0Id(data.auth0Id);
    if (existingUser) {
      return existingUser;
    }

    // Create the user via the domain-agnostic repository
    return this.userRepository.create(data);
  }
}
