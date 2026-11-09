import { IsOptional, IsString } from 'class-validator';

export class CancelarEventoDto {
  @IsOptional()
  @IsString()
  motivo?: string;
}
