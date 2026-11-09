export type TipoEvento = 'personal' | 'comunidad';
export type EstadoEvento = 'borrador' | 'publicado' | 'cancelado' | 'finalizado';
export type NivelRequerido = 'Cualquiera' | 'Principiante' | 'Intermedio' | 'Avanzado';


export interface Evento {
  id: string;
  tipo: TipoEvento;
  titulo: string;
  deporte: string;
  fechaHora: Date;
  lugar: string;
  cupoMaximo: number;
  nivelRequerido: NivelRequerido;
  descripcion?: string;
  fotoUrl?: string;
  estado: EstadoEvento;
  motivoCancelacion?: string;
  creadorId: string;
  participantesIds: string[];
  calificacionPromedio?: number | null;
  creadoEn: Date;
}
