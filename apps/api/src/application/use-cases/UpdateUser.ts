import { IUser } from "../../domain/IUser.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";

export class UpdateUser {
  constructor(private userRepository: IUserRepository) { }

  async execute(auth0Id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findByAuth0Id(auth0Id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.update(user.id, data);
  }
}
