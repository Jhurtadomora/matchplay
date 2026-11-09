import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { ChatsService } from './chats.service';
import { EnviarMensajeDto } from './dto/enviar-mensaje.dto';
import { ResponderPropuestaDto } from './dto/responder-propuesta.dto';
import { UsersService } from '../auth/users.service';
import { Chat } from './entities/chat.entity';
import { Usuario } from '../auth/entities/usuario.entity';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async listar(
    @CurrentUser() usuario: JwtPayload,
    @Query('deporte') deporte?: string,
  ) {

    const filtro = deporte?.toLowerCase().trim();

    const chats = await this.chatsService.listarDeUsuario(usuario.sub);
    const otros = await this.usersService.buscarPorIds(
      chats.map((c) => this.otroId(c, usuario.sub)),
    );

    return chats
      .filter((chat) => {
        if (!filtro) return true;
        const otro = otros.get(this.otroId(chat, usuario.sub));
        return (otro?.deportesFavoritos ?? []).some((d) =>
          d.toLowerCase().includes(filtro),
        );
      })
      .map((chat) => this.aResumen(chat, usuario.sub, otros.get(this.otroId(chat, usuario.sub))));
  }

  @Get(':chatId/mensajes')
  listarMensajes(
    @Param('chatId') chatId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.chatsService.listarMensajes(chatId, usuario.sub);
  }

  @Post(':chatId/mensajes')
  enviarMensaje(
    @Param('chatId') chatId: string,
    @Body() datos: EnviarMensajeDto,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.chatsService.enviarMensaje(chatId, usuario.sub, datos);
  }

  @Post(':chatId/mensajes/:mensajeId/responder')
  responder(
    @Param('chatId') chatId: string,
    @Param('mensajeId') mensajeId: string,
    @Body() datos: ResponderPropuestaDto,
    @CurrentUser() usuario: JwtPayload,
  ) {
    return this.chatsService.responderPropuesta(
      chatId,
      mensajeId,
      usuario.sub,
      datos.respuesta,
    );
  }


  private otroId(chat: Chat, usuarioActualId: string): string {
    return chat.usuarioIdA === usuarioActualId ? chat.usuarioIdB : chat.usuarioIdA;
  }

  private aResumen(chat: Chat, usuarioActualId: string, otro: Usuario | undefined) {
    const ultimo = chat.mensajes[chat.mensajes.length - 1];
    const noLeidos = chat.mensajes.filter(
      (m) => m.autorId !== usuarioActualId && !m.leido,
    ).length;

    return {
      id: chat.id,
      perfil: otro
        ? {
            id: otro.id,
            nombre: otro.nombreUsuario,
            edad: otro.edad,
            fotoUrl: otro.fotoUrl,
            deporte: otro.deportesFavoritos[0],
            nivel: otro.nivel,
          }
        : null,
      ultimoMensaje: this.textoResumen(ultimo),
      ultimoMensajeFecha: ultimo?.fecha,
      noLeidos,

      enLinea: false,
    };
  }

  private textoResumen(mensaje?: Chat['mensajes'][number]): string | undefined {
    if (!mensaje) return undefined;
    if (mensaje.tipo === 'propuesta_evento') return '📅 Propuesta de evento';
    return mensaje.texto;
  }
}
