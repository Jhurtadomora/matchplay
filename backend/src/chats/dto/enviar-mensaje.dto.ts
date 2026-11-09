import { IsIn, IsString, ValidateIf } from 'class-validator';
import { TipoMensaje } from '../entities/mensaje.entity';

export class EnviarMensajeDto {
  @IsIn(['texto', 'propuesta_evento'])
  tipo: TipoMensaje;

  @ValidateIf((o) => o.tipo === 'texto')
  @IsString()
  texto?: string;

  @ValidateIf((o) => o.tipo === 'propuesta_evento')
  @IsString()
  eventoId?: string;
}