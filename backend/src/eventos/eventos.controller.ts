import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { EventosService } from './eventos.service';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { ActualizarEventoDto } from './dto/actualizar-evento.dto';
import { CancelarEventoDto } from './dto/cancelar-evento.dto';
import { UsersService } from '../auth/users.service';
import { EstadoEvento, Evento } from './entities/evento.entity';
import { Usuario } from '../auth/entities/usuario.entity';

const ROLES_MIOS = ['organizador', 'participante'];
const ESTADOS = ['borrador', 'publicado', 'cancelado', 'finalizado'];


@UseGuards(JwtAuthGuard)
@Controller('eventos')
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async listar(
    @Query('tipo') tipo?: 'personal' | 'comunidad',
    @Query('deporte') deporte?: string,
    @Query('estado') estado?: EstadoEvento,
  ) {
    const eventos = await this.eventosService.listarPublicados(
      tipo,
      deporte,
      estado ?? 'publicado',
    );
    return this.aRespuestas(eventos);
  }

  @Get('mios')
  async listarMios(
    @CurrentUser() usuario: JwtPayload,
    @Query('rol') rol?: string,
    @Query('estado') estado?: string,
  ) {
    if (rol !== undefined && !ROLES_MIOS.includes(rol)) {
      throw new BadRequestException('rol debe ser organizador o participante');
    }
    if (estado !== undefined && !ESTADOS.includes(estado)) {
      throw new BadRequestException(`estado debe ser uno de: ${ESTADOS.join(', ')}`);
    }
    const eventos = await this.eventosService.listarMios(
      usuario.sub,
      rol as 'organizador' | 'participante' | undefined,
      estado as EstadoEvento | undefined,
    );
    return this.aRespuestas(eventos);
  }

  @Post()
  async crear(@Body() datos: CrearEventoDto, @CurrentUser() usuario: JwtPayload) {
    return this.aRespuesta(await this.eventosService.crear(usuario.sub, datos));
  }

  @Get(':eventoId')
  async obtenerUno(
    @Param('eventoId') eventoId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(
      await this.eventosService.obtenerVisible(eventoId, usuario.sub),
    );
  }

  @Patch(':eventoId')
  async actualizar(
    @Param('eventoId') eventoId: string,
    @Body() cambios: ActualizarEventoDto,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(
      await this.eventosService.actualizar(eventoId, usuario.sub, cambios),
    );
  }

  @Post(':eventoId/publicar')
  async publicar(
    @Param('eventoId') eventoId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(
      await this.eventosService.publicar(eventoId, usuario.sub),
    );
  }

  @Post(':eventoId/cancelar')
  @HttpCode(200)
  async cancelar(
    @Param('eventoId') eventoId: string,
    @Body() datos: CancelarEventoDto,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(
      await this.eventosService.cancelar(eventoId, usuario.sub, datos?.motivo),
    );
  }

  @Post(':eventoId/join')
  @HttpCode(200)
  async unirse(
    @Param('eventoId') eventoId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(await this.eventosService.unirse(eventoId, usuario.sub));
  }

  @Delete(':eventoId/join')
  async salir(
    @Param('eventoId') eventoId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.aRespuesta(await this.eventosService.salir(eventoId, usuario.sub));
  }

  @Get(':eventoId/participantes')
  async participantes(
    @Param('eventoId') eventoId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    const ids = await this.eventosService.participantesIds(eventoId, usuario.sub);
    const usuarios = await this.usersService.buscarPorIds(ids);
    return ids
      .map((id) => usuarios.get(id))
      .filter((u): u is NonNullable<typeof u> => Boolean(u))
      .map((u) => ({
        id: u.id,
        nombre: u.nombreUsuario,
        edad: u.edad,
        fotoUrl: u.fotoUrl,
        nivel: u.nivel,
      }));
  }


  private async aRespuesta(evento: Evento) {
    const [respuesta] = await this.aRespuestas([evento]);
    return respuesta;
  }


  private async aRespuestas(eventos: Evento[]) {
    const creadores = await this.usersService.buscarPorIds(
      eventos.map((e) => e.creadorId),
    );
    return eventos.map((evento) => this.armarRespuesta(evento, creadores.get(evento.creadorId)));
  }

  private armarRespuesta(evento: Evento, creador: Usuario | undefined) {
    return {
      id: evento.id,
      tipo: evento.tipo,
      titulo: evento.titulo,
      deporte: evento.deporte,
      fechaHora: evento.fechaHora,
      lugar: evento.lugar,
      cupoMaximo: evento.cupoMaximo,
      nivelRequerido: evento.nivelRequerido,
      descripcion: evento.descripcion,
      fotoUrl: evento.fotoUrl,
      estado: this.eventosService.estadoParaRespuesta(evento),
      creador: creador
        ? {
            id: creador.id,
            nombre: creador.nombreUsuario,
            edad: creador.edad,
            fotoUrl: creador.fotoUrl,
            deporte: creador.deportesFavoritos[0],
            nivel: creador.nivel,
          }
        : null,
      cuposOcupados: this.eventosService.cuposOcupados(evento),
      calificacionPromedio: evento.calificacionPromedio,
    };
  }
}
