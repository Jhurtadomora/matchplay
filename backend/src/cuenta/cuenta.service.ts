import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../auth/users.service';
import { AuthService } from '../auth/auth.service';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { PreferenciasDeportivasDto } from './dto/preferencias-deportivas.dto';
import { HorarioDisponibleDto } from './dto/horario-disponible.dto';
import { ActualizarNotificacionesDto } from './dto/preferencias-notificaciones.dto';
import { ActualizarPrivacidadDto } from './dto/preferencias-privacidad.dto';
import { ActualizarIdiomaDto, ActualizarTemaDto } from './dto/idioma-tema.dto';
import { Usuario } from '../auth/entities/usuario.entity';
import { MatchesService } from '../matches/matches.service';
import { ChatsService } from '../chats/chats.service';
import { EventosService } from '../eventos/eventos.service';


@Injectable()
export class CuentaService {
  constructor(
    private readonly usersService: UsersService,
    private readonly matchesService: MatchesService,
    private readonly chatsService: ChatsService,
    private readonly eventosService: EventosService,
    private readonly authService: AuthService,
  ) {}

  private async obtener(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usersService.buscarPorId(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }


  async perfilPropio(usuarioId: string) {
    return this.aPerfilPropio(await this.obtener(usuarioId));
  }

  async actualizarPerfil(usuarioId: string, cambios: ActualizarPerfilDto) {
    const actualizado = await this.usersService.actualizar(usuarioId, { ...cambios });
    if (!actualizado) throw new NotFoundException('Usuario no encontrado');
    return this.aPerfilPropio(actualizado);
  }

  
  async eliminarCuenta(usuarioId: string) {
    await this.obtener(usuarioId); 

    await this.matchesService.eliminarTodoDeUsuario(usuarioId);
    await this.chatsService.eliminarTodoDeUsuario(usuarioId);
    await this.eventosService.eliminarParticipacionesYEventosDeUsuario(usuarioId);
    await this.usersService.quitarDeTodosLosBloqueados(usuarioId);
    await this.authService.eliminarTokensDeUsuario(usuarioId);

    await this.usersService.eliminar(usuarioId);
  }

  async descargarDatos(usuarioId: string) {
    const { passwordHash, ...resto } = await this.obtener(usuarioId);
    return resto;
  }


  async obtenerPreferenciasDeportivas(usuarioId: string) {
    const u = await this.obtener(usuarioId);
    return {
      deportesFavoritos: u.deportesFavoritos,
      nivel: u.nivel,
      radioBusquedaKm: u.radioBusquedaKm,
    };
  }

  async actualizarPreferenciasDeportivas(
    usuarioId: string,
    datos: PreferenciasDeportivasDto,
  ) {
    await this.usersService.actualizar(usuarioId, { ...datos });
    return this.obtenerPreferenciasDeportivas(usuarioId);
  }


  async obtenerHorario(usuarioId: string) {
    return (await this.obtener(usuarioId)).horarioDisponible;
  }

  async actualizarHorario(usuarioId: string, datos: HorarioDisponibleDto) {
    await this.usersService.actualizar(usuarioId, { horarioDisponible: datos });
    return this.obtenerHorario(usuarioId);
  }



  async obtenerNotificaciones(usuarioId: string) {
    return (await this.obtener(usuarioId)).notificaciones;
  }

  async actualizarNotificaciones(usuarioId: string, cambios: ActualizarNotificacionesDto) {
    await this.obtener(usuarioId);
    const set = Object.fromEntries(
      Object.entries(cambios).map(([clave, valor]) => [`notificaciones.${clave}`, valor]),
    );
    const u = await this.usersService.actualizar(usuarioId, set);
    return u!.notificaciones;
  }



  async obtenerPrivacidad(usuarioId: string) {
    return (await this.obtener(usuarioId)).privacidad;
  }

  async actualizarPrivacidad(usuarioId: string, cambios: ActualizarPrivacidadDto) {
    await this.obtener(usuarioId);
    const { verificacionPerfil: _ignorado, ...editables } = cambios;
    const set = Object.fromEntries(
      Object.entries(editables).map(([clave, valor]) => [`privacidad.${clave}`, valor]),
    );
    const u = await this.usersService.actualizar(usuarioId, set);
    return u!.privacidad;
  }


  async listarBloqueados(usuarioId: string) {
    const u = await this.obtener(usuarioId);
    const perfiles = await this.usersService.buscarPorIds(u.bloqueadosIds);
    return u.bloqueadosIds
      .map((id) => perfiles.get(id))
      .filter((perfil): perfil is NonNullable<typeof perfil> => Boolean(perfil))
      .map((perfil) => ({
        id: perfil.id,
        nombre: perfil.nombreUsuario,
        edad: perfil.edad,
        fotoUrl: perfil.fotoUrl,
      }));
  }

  async bloquear(usuarioId: string, perfilId: string) {
    if (perfilId === usuarioId) {
      throw new BadRequestException('No puedes bloquearte a ti mismo');
    }
    const existe = await this.usersService.buscarPorId(perfilId);
    if (!existe) throw new NotFoundException('Perfil no encontrado');

    await this.obtener(usuarioId);
    await this.usersService.agregarBloqueado(usuarioId, perfilId); 
    return this.listarBloqueados(usuarioId);
  }

  async desbloquear(usuarioId: string, perfilId: string) {
    await this.obtener(usuarioId);
    await this.usersService.quitarBloqueado(usuarioId, perfilId);
  }


  async actualizarIdioma(usuarioId: string, datos: ActualizarIdiomaDto) {
    await this.usersService.actualizar(usuarioId, { idioma: datos.idioma });
    return { idioma: datos.idioma };
  }

  async actualizarTema(usuarioId: string, datos: ActualizarTemaDto) {
    await this.usersService.actualizar(usuarioId, { tema: datos.tema });
    return { tema: datos.tema };
  }

  private aPerfilPropio(u: Usuario) {
    return {
      id: u.id,
      nombre: u.nombreUsuario,
      edad: u.edad,
      fotoUrl: u.fotoUrl,
      deporte: u.deportesFavoritos[0],
      nivel: u.nivel,
      nombreCompleto: u.nombreCompleto,
      nombreUsuario: u.nombreUsuario,
      correo: u.correo,
      ciudad: u.ciudad,
      sobreMi: u.sobreMi,
      estadisticas: u.estadisticas,
    };
  }
}
