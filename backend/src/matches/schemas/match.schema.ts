import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Colección "matches": un documento por cada pareja que se dio like mutuo.
 * `par` es la pareja ordenada ("usrA|usrB") con índice único: aunque los dos
 * den like en el mismo milisegundo, la base solo permite UN match por pareja.
 */
@Schema({ collection: 'matches', versionKey: false })
export class MatchDoc {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  usuarioIdA: string;

  @Prop({ type: String, required: true, index: true })
  usuarioIdB: string;

  @Prop({ type: String, required: true, unique: true })
  par: string;

  @Prop({ type: Date, default: Date.now })
  creadoEn: Date;
}

export const MatchSchema = SchemaFactory.createForClass(MatchDoc);
