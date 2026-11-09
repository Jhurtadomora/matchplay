import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { MatchesService } from './matches.service';
import { UsersService } from '../auth/users.service';


@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async listar(@CurrentUser() usuario: JwtPayload) {
    const matches = await this.matchesService.listarDeUsuario(usuario.sub);
    const otrosIds = matches.map((m) =>
      this.matchesService.otroParticipante(m, usuario.sub),
    );
    const usuarios = await this.usersService.buscarPorIds(otrosIds);
    return matches.map((match) => {
      const otro = usuarios.get(
        this.matchesService.otroParticipante(match, usuario.sub),
      );
      return {
        id: match.id,
        perfil: otro
          ? {
              id: otro.id,
              nombre: otro.nombreUsuario,
              edad: otro.edad,
              fotoUrl: otro.fotoUrl,
              nivel: otro.nivel,
            }
          : null,
        creadoEn: match.creadoEn,
      };
    });
  }

  @Delete(':matchId')
  @HttpCode(204)
  async eliminar(
    @Param('matchId') matchId: string,
    @CurrentUser() usuario: JwtPayload,
  ) {
    await this.matchesService.eliminar(matchId, usuario.sub);
  }
}
