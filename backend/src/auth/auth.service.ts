import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { crearPreferenciasPorDefecto, Usuario } from './entities/usuario.entity';
import { TokenRecuperacionDoc } from './schemas/token-recuperacion.schema';
import { esErrorDeDuplicado } from '../common/mongo/mongo.utils';

const SALT_ROUNDS = 10;
const TOKEN_RECUPERACION_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(TokenRecuperacionDoc.name)
    private readonly tokenModel: Model<TokenRecuperacionDoc>,
  ) {}

  async registrar(datos: RegistroDto) {
    const existente = await this.usersService.buscarPorCorreo(datos.correo);
    if (existente) {
      throw new ConflictException('Ya existe una cuenta con ese correo');
    }

    const passwordHash = await bcrypt.hash(datos.password, SALT_ROUNDS);

    let usuario: Usuario;
    try {
      usuario = await this.usersService.crear({
        nombreUsuario: datos.nombreUsuario,
        correo: datos.correo,
        passwordHash,
        edad: datos.edad,
        deportesFavoritos: datos.deportesFavoritos,
        nivel: 'Principiante',
        estadisticas: {
          partidosJugados: 0,
          calificacion: 0,
          eventosOrganizados: 0,
        },
        ...crearPreferenciasPorDefecto(),
      });
    } catch (error) {
      if (esErrorDeDuplicado(error)) {
        throw new ConflictException('Ya existe una cuenta con ese correo');
      }
      throw error;
    }

    return this.firmarToken(usuario);
  }

  async login(datos: LoginDto) {
    const usuario = await this.usersService.buscarPorCorreo(datos.correo);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(
      datos.password,
      usuario.passwordHash,
    );
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.firmarToken(usuario);
  }

  logout() {
    return { mensaje: 'Sesión cerrada' };
  }


  async recuperarPassword(correo: string, nombreUsuario: string) {
    const respuesta: { mensaje: string; token?: string } = {
      mensaje: 'Si los datos coinciden, se envió un enlace de recuperación',
    };

    const usuario = await this.usersService.buscarPorCorreo(correo);
    if (usuario && usuario.nombreUsuario === nombreUsuario) {
      const token = uuid();
      await this.tokenModel.create({
        _id: token,
        usuarioId: usuario.id,
        expira: new Date(Date.now() + TOKEN_RECUPERACION_MS),
      });

      if (process.env.NODE_ENV !== 'production') {
        this.logger.log(`Token de recuperación para ${correo}: ${token}`);
        respuesta.token = token;
      }
    }
    return respuesta;
  }

  async restablecerPassword(token: string, nuevaPassword: string) {
    const registro = await this.tokenModel.findOneAndDelete({ _id: token }).lean();
    if (!registro || registro.expira.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
    const actualizado = await this.usersService.actualizar(registro.usuarioId, {
      passwordHash,
    });
    if (!actualizado) {
      throw new BadRequestException('Token inválido o expirado');
    }
    return { mensaje: 'Contraseña actualizada' };
  }

  async eliminarTokensDeUsuario(usuarioId: string): Promise<void> {
    await this.tokenModel.deleteMany({ usuarioId });
  }

  private firmarToken(usuario: Usuario) {
    const payload = { sub: usuario.id, nombreUsuario: usuario.nombreUsuario };
    return {
      token: this.jwtService.sign(payload),
      usuario: this.aPerfilPropio(usuario),
    };
  }

  private aPerfilPropio(usuario: Usuario) {
    const { passwordHash, ...resto } = usuario;
    return resto;
  }
}
