import { PrismaClient } from "@prisma/client";

import { IUser, UserRole } from "../../domain/IUser.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  private mapToEntity(user: any): IUser {
    return {
      id: user.id.toString(),
      email: user.email,
      auth0Id: user.auth0Id,
      role: (user.role as unknown as UserRole) || UserRole.MEMBER,
      name: user.name || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.mapToEntity(user) : null;
  }

  async findAll(): Promise<IUser[]> {
    const users = await prisma.user.findMany();
    return users.map(user => this.mapToEntity(user));
  }

  async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { auth0Id } });
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.mapToEntity(user) : null;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.create({
      data: {
        email: data.email!,
        auth0Id: data.auth0Id!,
        name: data.name,
        role: (data.role as any) || "MEMBER",
      },
    });
    return this.mapToEntity(user);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        auth0Id: data.auth0Id,
        name: data.name,
        role: (data.role as any) || undefined,
      },
    });
    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({ where: { id } });
    return true;
  }
}
