import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../auth/users.service';
import { MatchesService } from '../matches/matches.service';
import { ChatsService } from '../chats/chats.service';
import { Usuario } from '../auth/entities/usuario.entity';

/** Forma pública de un perfil (tarjeta de swipe), nunca incluye datos privados. */
function aPerfilPublico(usuario: Usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombreUsuario,
    edad: usuario.edad,
    fotoUrl: usuario.fotoUrl,
    deporte: usuario.deportesFavoritos[0],
    nivel: usuario.nivel,
  };
}

@Injectable()
export class PerfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly matchesService: MatchesService,
    private readonly chatsService: ChatsService,
  ) {}

  /** Corresponde a GET /perfiles/feed (pantalla HOME de swipe). */
  async feed(usuarioActualId: string, deporte?: string, limite?: string) {
    let maximo: number | undefined;
    if (limite !== undefined) {
      maximo = Number(limite);
      if (!Number.isInteger(maximo) || maximo < 1) {
        throw new BadRequestException('limite debe ser un entero mayor o igual a 1');
      }
    }

    // Los perfiles que el usuario ya descartó no vuelven a aparecer.
    const descartados = await this.matchesService.idsDescartadosPor(usuarioActualId);
    const usuarios = await this.usersService.listarParaFeed(
      [usuarioActualId, ...descartados],
      deporte,
      maximo,
    );
    return usuarios.map((usuario) => aPerfilPublico(usuario));
  }

  async obtenerUno(perfilId: string) {
    const usuario = await this.usersService.buscarPorId(perfilId);
    if (!usuario) {
      throw new NotFoundException('Perfil no encontrado');
    }
    return aPerfilPublico(usuario);
  }

  /**
   * Corresponde a POST /perfiles/{perfilId}/like. Si el otro usuario ya
   * había dado like antes, se forma un match y, con él, el chat entre
   * ambos (así la pantalla de Chats ya tiene con quién hablar apenas
   * ocurre el match, sin un paso adicional).
   */
  async like(usuarioActualId: string, perfilId: string) {
    await this.asegurarQueExiste(perfilId);
    if (perfilId === usuarioActualId) {
      throw new BadRequestException('No puedes dar like a tu propio perfil');
    }
    const match = await this.matchesService.registrarLike(usuarioActualId, perfilId);
    if (match) {
      await this.chatsService.obtenerOCrearChat(usuarioActualId, perfilId);
    }
    return { match: Boolean(match), matchId: match?.id };
  }

  async pass(usuarioActualId: string, perfilId: string) {
    await this.asegurarQueExiste(perfilId);
    if (perfilId === usuarioActualId) {
      throw new BadRequestException('No puedes descartar tu propio perfil');
    }
    // Se guarda el descarte para que el perfil no vuelva a salir en el feed.
    await this.matchesService.registrarPass(usuarioActualId, perfilId);
    return { mensaje: 'Perfil descartado' };
  }

  private async asegurarQueExiste(perfilId: string) {
    const usuario = await this.usersService.buscarPorId(perfilId);
    if (!usuario) {
      throw new NotFoundException('Perfil no encontrado');
    }
  }
}
