import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';


@Schema({ _id: false })
class HorarioDisponibleDoc {
  @Prop({ type: [String], default: [] })
  dias: string[];

  @Prop({ type: String })
  franjaHoraria?: string;

  @Prop({ type: String })
  notas?: string;
}
const HorarioDisponibleSchema = SchemaFactory.createForClass(HorarioDisponibleDoc);

@Schema({ _id: false })
class NotificacionesDoc {
  @Prop({ type: Boolean, required: true }) nuevasSolicitudes: boolean;
  @Prop({ type: Boolean, required: true }) mensajesNuevos: boolean;
  @Prop({ type: Boolean, required: true }) recordatorioPartido: boolean;
  @Prop({ type: Boolean, required: true }) nuevosEventosCerca: boolean;
  @Prop({ type: Boolean, required: true }) cuposCasiLlenos: boolean;
  @Prop({ type: Boolean, required: true }) cambiosEnEventos: boolean;
  @Prop({ type: Boolean, required: true }) novedadesYPromociones: boolean;
}
const NotificacionesSchema = SchemaFactory.createForClass(NotificacionesDoc);

@Schema({ _id: false })
class PrivacidadDoc {
  @Prop({ type: Boolean, required: true }) perfilVisibleEnBusqueda: boolean;
  @Prop({ type: Boolean, required: true }) mostrarEdad: boolean;
  @Prop({ type: Boolean, required: true }) mostrarUbicacionExacta: boolean;
  @Prop({ type: String, enum: ['pendiente', 'verificado'], required: true })
  verificacionPerfil: string;
}
const PrivacidadSchema = SchemaFactory.createForClass(PrivacidadDoc);

@Schema({ _id: false })
class EstadisticasDoc {
  @Prop({ type: Number, default: 0 }) partidosJugados: number;
  @Prop({ type: Number, default: 0 }) calificacion: number;
  @Prop({ type: Number, default: 0 }) eventosOrganizados: number;
}
const EstadisticasSchema = SchemaFactory.createForClass(EstadisticasDoc);

@Schema({ collection: 'usuarios', versionKey: false })
export class UsuarioDoc {
  @Prop({ type: String, default: () => `usr_${uuid()}` })
  _id: string;

  @Prop({ type: String, required: true, trim: true })
  nombreUsuario: string;

  @Prop({ type: String, required: true, unique: true })
  correo: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String })
  nombreCompleto?: string;

  @Prop({ type: Number, required: true })
  edad: number;

  @Prop({ type: String })
  ciudad?: string;

  @Prop({ type: String })
  sobreMi?: string;

  @Prop({ type: String })
  fotoUrl?: string;

  @Prop({ type: [String], default: [] })
  deportesFavoritos: string[];

  @Prop({
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado'],
    required: true,
  })
  nivel: string;

  @Prop({ type: Number, required: true })
  radioBusquedaKm: number;

  @Prop({ type: HorarioDisponibleSchema, required: true })
  horarioDisponible: HorarioDisponibleDoc;

  @Prop({ type: NotificacionesSchema, required: true })
  notificaciones: NotificacionesDoc;

  @Prop({ type: PrivacidadSchema, required: true })
  privacidad: PrivacidadDoc;

  @Prop({ type: [String], default: [] })
  bloqueadosIds: string[];

  @Prop({ type: String, enum: ['es', 'en', 'pt'], default: 'es' })
  idioma: string;

  @Prop({ type: String, enum: ['oscuro', 'claro', 'automatico'], default: 'automatico' })
  tema: string;

  @Prop({ type: EstadisticasSchema, required: true })
  estadisticas: EstadisticasDoc;

  @Prop({ type: Date, default: Date.now })
  creadoEn: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(UsuarioDoc);
