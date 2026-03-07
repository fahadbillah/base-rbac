import * as admin from "firebase-admin";
import { IUser, UserRole } from "../../../domain/IUser.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";

export class FirebaseUserRepository implements IUserRepository {
  private collection = admin.firestore().collection("users");

  private mapToEntity(doc: admin.firestore.DocumentSnapshot): IUser {
    const data = doc.data()!;
    return {
      id: doc.id,
      email: data.email,
      auth0Id: data.auth0Id,
      role: (data.role as UserRole) || UserRole.MEMBER,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<IUser[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => this.mapToEntity(doc));
  }

  async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
    const snapshot = await this.collection.where("auth0Id", "==", auth0Id).limit(1).get();
    return snapshot.empty ? null : this.mapToEntity(snapshot.docs[0]);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.collection.where("email", "==", email).limit(1).get();
    return snapshot.empty ? null : this.mapToEntity(snapshot.docs[0]);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const docRef = await this.collection.add({
      ...data,
      role: data.role || UserRole.MEMBER,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return this.mapToEntity(doc);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await this.collection.doc(id).get();
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    await this.collection.doc(id).delete();
    return true;
  }
}
