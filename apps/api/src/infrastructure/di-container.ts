import { PrismaUserRepository } from "./database/PrismaUserRepository.js";
import { FirebaseUserRepository } from "./database/firebase/FirebaseUserRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";

// Simple Factory for Dependency Injection
export class DIContainer {
  private static _userRepository: IUserRepository;

  static getUserRepository(): IUserRepository {
    if (!this._userRepository) {
      // Toggle between Prisma and Firebase based on environment variable
      if (process.env.DB_ADAPTER === "firebase") {
        this._userRepository = new FirebaseUserRepository();
      } else {
        this._userRepository = new PrismaUserRepository();
      }
    }
    return this._userRepository;
  }
}
