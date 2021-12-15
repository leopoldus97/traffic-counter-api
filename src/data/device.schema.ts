import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ unique: true })
  pid: string;

  @Prop({ required: true, default: new Date() })
  timestamp: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
