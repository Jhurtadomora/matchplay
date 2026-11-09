import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';


@Schema({ collection: 'eventos', versionKey: false })
export class EventoDoc {
  @Prop({ type: String, default: () => `evt_${uuid()}` })
  _id: string;

  @Prop({ type: String, enum: ['personal', 'comunidad'], required: true })
  tipo: string;

  @Prop({ type: String, required: true })
  titulo: string;

  @Prop({ type: String, required: true })
  deporte: string;

  @Prop({ type: Date, required: true })
  fechaHora: Date;

  @Prop({ type: String, required: true })
  lugar: string;

  @Prop({ type: Number, required: true, min: 1 })
  cupoMaximo: number;

  @Prop({
    type: String,
    enum: ['Cualquiera', 'Principiante', 'Intermedio', 'Avanzado'],
    default: 'Cualquiera',
  })
  nivelRequerido: string;

  @Prop({ type: String })
  descripcion?: string;

  @Prop({ type: String })
  fotoUrl?: string;

  @Prop({
    type: String,
    enum: ['borrador', 'publicado', 'cancelado', 'finalizado'],
    default: 'borrador',
  })
  estado: string;

  @Prop({ type: String })
  motivoCancelacion?: string;

  @Prop({ type: String, required: true, index: true })
  creadorId: string;


  @Prop({ type: [String], default: [], index: true })
  participantesIds: string[];

  @Prop({ type: Number, default: null })
  calificacionPromedio?: number | null;

  @Prop({ type: Date, default: Date.now })
  creadoEn: Date;
}

export const EventoSchema = SchemaFactory.createForClass(EventoDoc);
EventoSchema.index({ estado: 1, fechaHora: 1 });
