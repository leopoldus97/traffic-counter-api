import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, index: true })
  pid: string;

  @Prop({ required: true, default: 'on', enum: [ 'on', 'off' ] })
  state: 'on' | 'off';

  @Prop({ required: false })
  fps?: number;

  @Prop({ required: true, default: new Date() })
  timestamp: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
