import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Location {
  @Prop({ required: true, type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: number[];
}
const LocationSchema = SchemaFactory.createForClass(Location);

export type TrafficType = 'CAR' | 'PASSENGER' | 'BICYCLE' | 'MOTORBIKE';

export type TrafficDocument = Traffic & Document;

@Schema()
export class Traffic {
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 'Test' })
  pid: string;

  @Prop({ type: LocationSchema, required: false })
  location?: any;

  @Prop({ required: true, default: 'CAR' })
  trafficType: TrafficType;

  @Prop({ required: true, default: new Date() })
  timestamp: Date;
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
