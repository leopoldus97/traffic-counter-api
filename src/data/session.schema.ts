import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ unique: true, type: String })
  token: string;

  @Prop()
  userId: string;

  @Prop()
  initialIpAddress: string;

  @Prop({ type: Date, default: new Date() })
  startDate: Date;

  @Prop({ type: Date, default: null })
  expiryDate: Date;

  @Prop({ type: Date, default: null })
  lastRequestDate: Date;

  @Prop()
  lifetime: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
