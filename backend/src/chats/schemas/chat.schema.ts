import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';


@Schema()
export class MensajeDoc {
  @Prop({ type: String, default: () => `msg_${uuid()}` })
  _id: string;

  @Prop({ type: String, required: true })
  chatId: string;

  @Prop({ type: String, required: true })
  autorId: string;

  @Prop({ type: String, enum: ['texto', 'propuesta_evento'], required: true })
  tipo: string;

  @Prop({ type: String })
  texto?: string;

  @Prop({ type: String })
  eventoId?: string;

  @Prop({ type: String, enum: ['pendiente', 'aceptada', 'rechazada'] })
  estadoPropuesta?: string;

  @Prop({ type: Date, default: Date.now })
  fecha: Date;

  @Prop({ type: Boolean, default: false })
  leido: boolean;
}
export const MensajeSchema = SchemaFactory.createForClass(MensajeDoc);


@Schema({ collection: 'chats', versionKey: false })
export class ChatDoc {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  usuarioIdA: string;

  @Prop({ type: String, required: true, index: true })
  usuarioIdB: string;

  @Prop({ type: String, required: true, unique: true })
  par: string;

  @Prop({ type: [MensajeSchema], default: [] })
  mensajes: MensajeDoc[];

  @Prop({ type: Date, default: Date.now })
  creadoEn: Date;
}
export const ChatSchema = SchemaFactory.createForClass(ChatDoc);
