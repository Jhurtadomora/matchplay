import {
  ArrayMinSize,
  Equals,
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegistroDto {
  @IsString()
  nombreUsuario: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  @Min(13)
  edad: number;


  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  deportesFavoritos: string[];

  @Equals(true, { message: 'Debes aceptar los términos y condiciones' })
  aceptaTerminos: boolean;
}
