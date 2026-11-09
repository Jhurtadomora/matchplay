import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { EstadoEvento, Evento } from './entities/evento.entity';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { ActualizarEventoDto } from './dto/actualizar-evento.dto';
import { EventoDoc } from './schemas/evento.schema';
import { aEntidad, aEntidades } from '../common/mongo/mongo.utils';


const FOTOS_POR_DEPORTE: Record<string, string> = {
  'Fútbol 5': '/fotos-eventos/futbol.jpg',
  'Básquet 3x3': '/fotos-eventos/basquet.jpg',
  Tenis: '/fotos-eventos/tenis.jpg',
  Ciclismo: '/fotos-eventos/ciclismo.jpg',
  Pádel: '/fotos-eventos/padel.jpg',
  Vóleibol: '/fotos-eventos/voleibol.jpg',
};

@Injectable()
export class EventosService {
  constructor(
    @InjectModel(EventoDoc.name) private readonly eventoModel: Model<EventoDoc>,
  ) {}

  async crear(creadorId: string, datos: CrearEventoDto): Promise<Evento> {
    const creado = await this.eventoModel.create({
      tipo: datos.tipo,
      titulo: datos.titulo,
      deporte: datos.deporte,
      fechaHora: new Date(datos.fechaHora),
      lugar: datos.lugar,
      cupoMaximo: datos.cupoMaximo,
      nivelRequerido: datos.nivelRequerido ?? 'Cualquiera',
      descripcion: datos.descripcion,
      fotoUrl: FOTOS_POR_DEPORTE[datos.deporte],
      estado: 'borrador',
      creadorId,
      participantesIds: [creadorId],
      calificacionPromedio: null,
    });
    return aEntidad<Evento>(creado.toObject());
  }


  private filtroDeEstado(estado: EstadoEvento): FilterQuery<EventoDoc> {
    const ahora = new Date();
    if (estado === 'finalizado') {
      return { estado: 'publicado', fechaHora: { $lt: ahora } };
    }
    if (estado === 'publicado') {
      return { estado: 'publicado', fechaHora: { $gte: ahora } };
    }
    return { estado };
  }

  async listarPublicados(
    tipo?: 'personal' | 'comunidad',
    deporte?: string,
    estado: EstadoEvento = 'publicado',
  ): Promise<Evento[]> {
    const filtro: FilterQuery<EventoDoc> = this.filtroDeEstado(estado);
    if (tipo) filtro.tipo = tipo;
    if (deporte) filtro.deporte = deporte;
    const docs = await this.eventoModel.find(filtro).sort({ creadoEn: 1 }).lean();
    return aEntidades<Evento>(docs);
  }


  async listarMios(
    usuarioId: string,
    rol: 'organizador' | 'participante' = 'organizador',
    estado?: EstadoEvento,
  ): Promise<Evento[]> {
    const filtro: FilterQuery<EventoDoc> = estado ? this.filtroDeEstado(estado) : {};
    if (rol === 'organizador') {
      filtro.creadorId = usuarioId;
    } else {
      filtro.creadorId = { $ne: usuarioId };
      filtro.participantesIds = usuarioId;
    }
    const docs = await this.eventoModel.find(filtro).sort({ creadoEn: 1 }).lean();
    return aEntidades<Evento>(docs);
  }


  private estadoEfectivo(evento: Evento): EstadoEvento {
    if (evento.estado === 'publicado' && evento.fechaHora.getTime() < Date.now()) {
      return 'finalizado';
    }
    return evento.estado;
  }

  estadoParaRespuesta(evento: Evento): EstadoEvento {
    return this.estadoEfectivo(evento);
  }

  async obtenerUno(eventoId: string): Promise<Evento> {
    const doc = await this.eventoModel.findById(eventoId).lean();
    if (!doc) {
      throw new NotFoundException('Evento no encontrado');
    }
    return aEntidad<Evento>(doc);
  }


  async obtenerVisible(eventoId: string, usuarioId: string): Promise<Evento> {
    const evento = await this.obtenerUno(eventoId);
    if (evento.estado === 'borrador' && evento.creadorId !== usuarioId) {
      throw new NotFoundException('Evento no encontrado');
    }
    return evento;
  }

  async actualizar(
    eventoId: string,
    usuarioId: string,
    cambios: ActualizarEventoDto,
  ): Promise<Evento> {
    const evento = await this.obtenerUno(eventoId);
    this.asegurarQueEsCreador(evento, usuarioId);

    if (evento.estado === 'cancelado') {
      throw new ConflictException('No se puede editar un evento cancelado');
    }
    if (
      cambios.cupoMaximo !== undefined &&
      cambios.cupoMaximo < evento.participantesIds.length
    ) {
      throw new BadRequestException(
        'El cupo máximo no puede ser menor al número de inscritos actuales',
      );
    }

    const set: Record<string, unknown> = Object.fromEntries(
      Object.entries(cambios).filter(([, valor]) => valor !== undefined),
    );
    if (cambios.fechaHora) set.fechaHora = new Date(cambios.fechaHora);
    if (cambios.deporte && FOTOS_POR_DEPORTE[cambios.deporte]) {
      set.fotoUrl = FOTOS_POR_DEPORTE[cambios.deporte];
    }


    const filtro: FilterQuery<EventoDoc> = { _id: eventoId, estado: { $ne: 'cancelado' } };
    if (cambios.cupoMaximo !== undefined) {
      filtro.$expr = { $lte: [{ $size: '$participantesIds' }, cambios.cupoMaximo] };
    }
    const actualizado = await this.eventoModel
      .findOneAndUpdate(filtro, { $set: set }, { new: true })
      .lean();
    if (!actualizado) {
      throw new ConflictException(
        'El evento cambió mientras se editaba (cancelado o con más inscritos); intenta de nuevo',
      );
    }
    return aEntidad<Evento>(actualizado);
  }

  async publicar(eventoId: string, usuarioId: string): Promise<Evento> {
    const evento = await this.obtenerUno(eventoId);
    this.asegurarQueEsCreador(evento, usuarioId);

    const actualizado = await this.eventoModel
      .findOneAndUpdate(
        { _id: eventoId, estado: 'borrador' },
        { $set: { estado: 'publicado' } },
        { new: true },
      )
      .lean();
    if (!actualizado) {
      throw new ConflictException('Solo un evento en borrador puede publicarse');
    }
    return aEntidad<Evento>(actualizado);
  }

  async cancelar(eventoId: string, usuarioId: string, motivo?: string): Promise<Evento> {
    const evento = await this.obtenerUno(eventoId);
    this.asegurarQueEsCreador(evento, usuarioId);

    const ahora = new Date();
    const actualizado = await this.eventoModel
      .findOneAndUpdate(
        {
          _id: eventoId,
          $or: [
            { estado: 'borrador' },
            { estado: 'publicado', fechaHora: { $gte: ahora } },
          ],
        },
        { $set: { estado: 'cancelado', ...(motivo !== undefined && { motivoCancelacion: motivo }) } },
        { new: true },
      )
      .lean();
    if (!actualizado) {
      throw new ConflictException('El evento ya terminó su ciclo de vida');
    }
    return aEntidad<Evento>(actualizado);
  }

  async unirse(eventoId: string, usuarioId: string): Promise<Evento> {
    const actualizado = await this.eventoModel
      .findOneAndUpdate(
        {
          _id: eventoId,
          estado: 'publicado',
          fechaHora: { $gte: new Date() },
          participantesIds: { $ne: usuarioId },
          $expr: { $lt: [{ $size: '$participantesIds' }, '$cupoMaximo'] },
        },
        { $addToSet: { participantesIds: usuarioId } },
        { new: true },
      )
      .lean();
    if (actualizado) return aEntidad<Evento>(actualizado);


    const evento = await this.obtenerUno(eventoId);
    if (evento.estado !== 'publicado' || this.estadoEfectivo(evento) === 'finalizado') {
      throw new ConflictException('Solo puedes unirte a un evento publicado');
    }
    if (evento.participantesIds.includes(usuarioId)) {
      throw new ConflictException('Ya estás en este evento');
    }
    throw new ConflictException('El evento ya alcanzó su cupo máximo');
  }


  async salir(eventoId: string, usuarioId: string): Promise<Evento> {
    const evento = await this.obtenerUno(eventoId);

    if (evento.creadorId === usuarioId) {
      throw new ForbiddenException(
        'El creador no puede salir de su propio evento; usa cancelar',
      );
    }
    if (!evento.participantesIds.includes(usuarioId)) {
      throw new BadRequestException('No estás inscrito en este evento');
    }
    const actualizado = await this.eventoModel
      .findByIdAndUpdate(eventoId, { $pull: { participantesIds: usuarioId } }, { new: true })
      .lean();
    return aEntidad<Evento>(actualizado ?? evento);
  }

  async participantesIds(eventoId: string, usuarioId: string): Promise<string[]> {
    return (await this.obtenerVisible(eventoId, usuarioId)).participantesIds;
  }

  cuposOcupados(evento: Evento): number {
    return evento.participantesIds.length;
  }


  async eliminarParticipacionesYEventosDeUsuario(usuarioId: string): Promise<void> {
    await this.eventoModel.updateMany(
      { creadorId: usuarioId, estado: { $ne: 'cancelado' } },
      {
        $set: {
          estado: 'cancelado',
          motivoCancelacion: 'El organizador eliminó su cuenta',
        },
      },
    );
    await this.eventoModel.updateMany(
      { creadorId: { $ne: usuarioId }, participantesIds: usuarioId },
      { $pull: { participantesIds: usuarioId } },
    );
  }

  private asegurarQueEsCreador(evento: Evento, usuarioId: string) {
    if (evento.creadorId !== usuarioId) {
      throw new ForbiddenException('Solo el creador del evento puede hacer esto');
    }
  }
}
