import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ unique: true, type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ default: false })
  enabled: boolean;

  @Prop({ type: Date, default: new Date() })
  createDate: Date;

  @Prop({ type: Date, default: null })
  lastLoginDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
