import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  readonly name: string;

  @Prop({ required: true, unique: true })
  readonly email: string;

  @Prop({ required: true, unique: true })
  readonly username: string;

  @Prop({ required: true })
  readonly password: string;

  @Prop()
  readonly gender: string;

  @Prop()
  readonly birthday: Date;

  @Prop()
  readonly horoscope: string;

  @Prop()
  readonly zodiac: string;

  @Prop()
  readonly height: string;

  @Prop()
  readonly weight: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
