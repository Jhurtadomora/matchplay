import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';


export class PreferenciasNotificacionesBaseDto {
  @IsBoolean() nuevasSolicitudes: boolean;
  @IsBoolean() mensajesNuevos: boolean;
  @IsBoolean() recordatorioPartido: boolean;
  @IsBoolean() nuevosEventosCerca: boolean;
  @IsBoolean() cuposCasiLlenos: boolean;
  @IsBoolean() cambiosEnEventos: boolean;
  @IsBoolean() novedadesYPromociones: boolean;
}

export class ActualizarNotificacionesDto extends PartialType(
  PreferenciasNotificacionesBaseDto,
) {}