import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type CatDocument = HydratedDocument<Task>;

enum Status {
  PENDING,
  IN_PROGRESS,
  DONE,
}

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Status, type: String, default: Status.PENDING })
  status: Status;

  @Prop({ default: now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(Task);
