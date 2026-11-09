import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Chat } from './entities/chat.entity';
import { Mensaje } from './entities/mensaje.entity';
import { EnviarMensajeDto } from './dto/enviar-mensaje.dto';
import { EventosService } from '../eventos/eventos.service';
import { ChatDoc } from './schemas/chat.schema';
import {
  aEntidad,
  claveDePar,
  esErrorDeDuplicado,
} from '../common/mongo/mongo.utils';


function aChat(doc: unknown): Chat {
  const chat = aEntidad<Chat & { mensajes: unknown[] }>(doc);
  return { ...chat, mensajes: (chat.mensajes ?? []).map((m) => aEntidad<Mensaje>(m)) };
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatDoc.name) private readonly chatModel: Model<ChatDoc>,
    private readonly eventosService: EventosService,
  ) {}



  async obtenerOCrearChat(usuarioIdA: string, usuarioIdB: string): Promise<Chat> {
    const par = claveDePar(usuarioIdA, usuarioIdB);
    try {
      const chat = await this.chatModel
        .findOneAndUpdate(
          { par },
          {
            $setOnInsert: {
              _id: `chat_${uuid()}`,
              usuarioIdA,
              usuarioIdB,
              mensajes: [],
              creadoEn: new Date(),
            },
          },
          { upsert: true, new: true },
        )
        .lean();
      return aChat(chat);
    } catch (error) {
      if (!esErrorDeDuplicado(error)) throw error;
      const existente = await this.chatModel.findOne({ par }).lean();
      return aChat(existente);
    }
  }

  async listarDeUsuario(usuarioId: string): Promise<Chat[]> {
    const docs = await this.chatModel
      .find({ $or: [{ usuarioIdA: usuarioId }, { usuarioIdB: usuarioId }] })
      .sort({ creadoEn: 1 })
      .lean();
    return docs.map((d) => aChat(d));
  }

  private async obtenerChatPermitido(chatId: string, usuarioId: string): Promise<Chat> {
    const doc = await this.chatModel.findById(chatId).lean();
    if (!doc) throw new NotFoundException('Chat no encontrado');
    const chat = aChat(doc);
    if (chat.usuarioIdA !== usuarioId && chat.usuarioIdB !== usuarioId) {
      throw new ForbiddenException('Este chat no te pertenece');
    }
    return chat;
  }

  async listarMensajes(chatId: string, usuarioId: string): Promise<Mensaje[]> {
    const chat = await this.obtenerChatPermitido(chatId, usuarioId);
    await this.chatModel.updateOne(
      { _id: chatId },
      { $set: { 'mensajes.$[m].leido': true } },
      { arrayFilters: [{ 'm.autorId': { $ne: usuarioId }, 'm.leido': false }] },
    );
    return chat.mensajes.map((m) =>
      m.autorId !== usuarioId ? { ...m, leido: true } : m,
    );
  }


  async enviarMensaje(
    chatId: string,
    usuarioId: string,
    datos: EnviarMensajeDto,
  ): Promise<Mensaje> {
    await this.obtenerChatPermitido(chatId, usuarioId);

    if (datos.tipo === 'texto' && !datos.texto) {
      throw new BadRequestException('texto es requerido cuando tipo es texto');
    }
    if (datos.tipo === 'propuesta_evento') {
      if (!datos.eventoId) {
        throw new BadRequestException(
          'eventoId es requerido cuando tipo es propuesta_evento',
        );
      }
      const evento = await this.eventosService.obtenerUno(datos.eventoId);
      if (evento.creadorId !== usuarioId) {
        throw new ForbiddenException(
          'Solo puedes proponer un evento que tú mismo creaste',
        );
      }
    }

    const mensaje: Mensaje = {
      id: `msg_${uuid()}`,
      chatId,
      autorId: usuarioId,
      tipo: datos.tipo,
      texto: datos.texto,
      eventoId: datos.eventoId,
      estadoPropuesta: datos.tipo === 'propuesta_evento' ? 'pendiente' : undefined,
      fecha: new Date(),
      leido: false,
    };
    const { id, ...resto } = mensaje;
    await this.chatModel.updateOne(
      { _id: chatId },
      { $push: { mensajes: { _id: id, ...resto } } },
    );
    return mensaje;
  }


  async responderPropuesta(
    chatId: string,
    mensajeId: string,
    usuarioId: string,
    respuesta: 'aceptar' | 'rechazar',
  ): Promise<Mensaje> {
    const chat = await this.obtenerChatPermitido(chatId, usuarioId);
    const mensaje = chat.mensajes.find((m) => m.id === mensajeId);
    if (!mensaje || mensaje.tipo !== 'propuesta_evento') {
      throw new NotFoundException('Propuesta de evento no encontrada');
    }
    if (mensaje.autorId === usuarioId) {
      throw new ForbiddenException(
        'Solo el destinatario de la propuesta puede responderla',
      );
    }
    if (mensaje.estadoPropuesta !== 'pendiente') {
      throw new ConflictException('Esta propuesta ya fue respondida');
    }

    if (respuesta === 'aceptar') {
      await this.eventosService.unirse(mensaje.eventoId!, usuarioId);
    }
    const nuevoEstado = respuesta === 'aceptar' ? 'aceptada' : 'rechazada';

    const resultado = await this.chatModel.updateOne(
      { _id: chatId, mensajes: { $elemMatch: { _id: mensajeId, estadoPropuesta: 'pendiente' } } },
      { $set: { 'mensajes.$.estadoPropuesta': nuevoEstado } },
    );
    if (resultado.modifiedCount === 0) {
      throw new ConflictException('Esta propuesta ya fue respondida');
    }
    return { ...mensaje, estadoPropuesta: nuevoEstado };
  }

  async eliminarTodoDeUsuario(usuarioId: string): Promise<void> {
    await this.chatModel.deleteMany({
      $or: [{ usuarioIdA: usuarioId }, { usuarioIdB: usuarioId }],
    });
  }
}
