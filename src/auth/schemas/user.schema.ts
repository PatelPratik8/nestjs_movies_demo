import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
  }

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
