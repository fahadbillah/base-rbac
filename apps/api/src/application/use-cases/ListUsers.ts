import { IUser } from "../../domain/IUser.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";

export class ListUsers {
  constructor(private userRepository: IUserRepository) { }

  async execute(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }
}
