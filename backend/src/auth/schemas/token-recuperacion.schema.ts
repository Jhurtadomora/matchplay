import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'tokens_recuperacion', versionKey: false })
export class TokenRecuperacionDoc {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, required: true })
  usuarioId: string;

  @Prop({ type: Date, required: true })
  expira: Date;
}

export const TokenRecuperacionSchema = SchemaFactory.createForClass(TokenRecuperacionDoc);
TokenRecuperacionSchema.index({ expira: 1 }, { expireAfterSeconds: 0 });
