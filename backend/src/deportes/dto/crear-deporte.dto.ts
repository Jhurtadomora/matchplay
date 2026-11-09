import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CrearDeporteDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsUrl()
  iconoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  disponibles?: number;
}
