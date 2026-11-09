import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'interacciones', versionKey: false })
export class InteraccionDoc {
  @Prop({ type: String, required: true })
  de: string;

  @Prop({ type: String, required: true })
  a: string;

  @Prop({ type: Boolean, default: false })
  like: boolean;

  @Prop({ type: Boolean, default: false })
  pass: boolean;
}

export const InteraccionSchema = SchemaFactory.createForClass(InteraccionDoc);
InteraccionSchema.index({ de: 1, a: 1 }, { unique: true });
InteraccionSchema.index({ a: 1 });
