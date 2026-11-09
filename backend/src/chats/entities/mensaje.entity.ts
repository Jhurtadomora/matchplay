export type TipoMensaje = 'texto' | 'propuesta_evento';
export type EstadoPropuesta = 'pendiente' | 'aceptada' | 'rechazada';

export interface Mensaje {
  id: string;
  chatId: string;
  autorId: string;
  tipo: TipoMensaje;
  texto?: string;
  eventoId?: string;
  estadoPropuesta?: EstadoPropuesta;
  fecha: Date;
  leido: boolean;
}
