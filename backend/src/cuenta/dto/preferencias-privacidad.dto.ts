import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class PreferenciasPrivacidadBaseDto {
  @IsBoolean() perfilVisibleEnBusqueda: boolean;
  @IsBoolean() mostrarEdad: boolean;
  @IsBoolean() mostrarUbicacionExacta: boolean;
}

export class ActualizarPrivacidadDto extends PartialType(
  PreferenciasPrivacidadBaseDto,
) {

  @IsOptional()
  @IsIn(['pendiente', 'verificado'])
  verificacionPerfil?: 'pendiente' | 'verificado';
}