
export type NivelJuego = 'Principiante' | 'Intermedio' | 'Avanzado';
export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';
export type FranjaHoraria = 'Mañana' | 'Tarde' | 'Noche';
export type Idioma = 'es' | 'en' | 'pt';
export type Tema = 'oscuro' | 'claro' | 'automatico';

export interface PreferenciasNotificaciones {
  nuevasSolicitudes: boolean;
  mensajesNuevos: boolean;
  recordatorioPartido: boolean;
  nuevosEventosCerca: boolean;
  cuposCasiLlenos: boolean;
  cambiosEnEventos: boolean;
  novedadesYPromociones: boolean;
}

export interface PreferenciasPrivacidad {
  perfilVisibleEnBusqueda: boolean;
  mostrarEdad: boolean;
  mostrarUbicacionExacta: boolean;
  verificacionPerfil: 'pendiente' | 'verificado';
}

export interface Usuario {
  id: string;
  nombreUsuario: string;
  correo: string;
  passwordHash: string;
  nombreCompleto?: string;
  edad: number;
  ciudad?: string;
  sobreMi?: string;
  fotoUrl?: string;
  deportesFavoritos: string[];
  nivel: NivelJuego;
  radioBusquedaKm: number;
  horarioDisponible: {
    dias: DiaSemana[];
    franjaHoraria?: FranjaHoraria;
    notas?: string;
  };
  notificaciones: PreferenciasNotificaciones;
  privacidad: PreferenciasPrivacidad;
  bloqueadosIds: string[];
  idioma: Idioma;
  tema: Tema;
  estadisticas: {
    partidosJugados: number;
    calificacion: number;
    eventosOrganizados: number;
  };
  creadoEn: Date;
}

export function crearPreferenciasPorDefecto() {
  return {
    radioBusquedaKm: 10,
    horarioDisponible: { dias: [] as DiaSemana[] },
    notificaciones: {
      nuevasSolicitudes: true,
      mensajesNuevos: true,
      recordatorioPartido: true,
      nuevosEventosCerca: true,
      cuposCasiLlenos: false,
      cambiosEnEventos: true,
      novedadesYPromociones: false,
    } satisfies PreferenciasNotificaciones,
    privacidad: {
      perfilVisibleEnBusqueda: true,
      mostrarEdad: true,
      mostrarUbicacionExacta: false,
      verificacionPerfil: 'pendiente',
    } satisfies PreferenciasPrivacidad,
    bloqueadosIds: [] as string[],
    idioma: 'es' as Idioma,
    tema: 'automatico' as Tema,
  };
}
