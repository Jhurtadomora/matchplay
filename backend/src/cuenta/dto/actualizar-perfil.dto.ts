import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';


export class ActualizarPerfilDto {
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsOptional()
  @IsInt()
  edad?: number;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  sobreMi?: string;

  @IsOptional()
  @IsUrl()
  fotoUrl?: string;
}