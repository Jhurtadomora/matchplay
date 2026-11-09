import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import { UsuarioDoc } from './schemas/usuario.schema';
import { aEntidad, aEntidades } from '../common/mongo/mongo.utils';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsuarioDoc.name) private readonly usuarioModel: Model<UsuarioDoc>,
  ) {}

  async crear(datos: Omit<Usuario, 'id' | 'creadoEn'>): Promise<Usuario> {
    const creado = await this.usuarioModel.create(datos);
    return aEntidad<Usuario>(creado.toObject());
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | undefined> {
    const doc = await this.usuarioModel.findOne({ correo }).lean();
    return doc ? aEntidad<Usuario>(doc) : undefined;
  }

  async buscarPorId(id: string): Promise<Usuario | undefined> {
    const doc = await this.usuarioModel.findById(id).lean();
    return doc ? aEntidad<Usuario>(doc) : undefined;
  }

  async buscarPorIds(ids: string[]): Promise<Map<string, Usuario>> {
    const unicos = [...new Set(ids)];
    if (unicos.length === 0) return new Map();
    const docs = await this.usuarioModel.find({ _id: { $in: unicos } }).lean();
    return new Map(aEntidades<Usuario>(docs).map((u) => [u.id, u]));
  }

  async listar(excluirId?: string): Promise<Usuario[]> {
    const filtro = excluirId ? { _id: { $ne: excluirId } } : {};
    const docs = await this.usuarioModel.find(filtro).lean();
    return aEntidades<Usuario>(docs);
  }


  async listarParaFeed(
    excluirIds: string[],
    deporte?: string,
    limite?: number,
  ): Promise<Usuario[]> {
    const filtro: Record<string, unknown> = { _id: { $nin: excluirIds } };
    if (deporte) filtro.deportesFavoritos = deporte;
    let consulta = this.usuarioModel.find(filtro).sort({ creadoEn: 1 });
    if (limite !== undefined) consulta = consulta.limit(limite);
    return aEntidades<Usuario>(await consulta.lean());
  }


  async actualizar(
    id: string,
    cambios: Record<string, unknown>,
  ): Promise<Usuario | undefined> {
    const set = Object.fromEntries(
      Object.entries(cambios).filter(([, valor]) => valor !== undefined),
    );
    const doc = await this.usuarioModel
      .findByIdAndUpdate(id, { $set: set }, { new: true })
      .lean();
    return doc ? aEntidad<Usuario>(doc) : undefined;
  }


  async agregarBloqueado(id: string, bloqueadoId: string): Promise<Usuario | undefined> {
    const doc = await this.usuarioModel
      .findByIdAndUpdate(id, { $addToSet: { bloqueadosIds: bloqueadoId } }, { new: true })
      .lean();
    return doc ? aEntidad<Usuario>(doc) : undefined;
  }

  async quitarBloqueado(id: string, bloqueadoId: string): Promise<Usuario | undefined> {
    const doc = await this.usuarioModel
      .findByIdAndUpdate(id, { $pull: { bloqueadosIds: bloqueadoId } }, { new: true })
      .lean();
    return doc ? aEntidad<Usuario>(doc) : undefined;
  }

  async quitarDeTodosLosBloqueados(bloqueadoId: string): Promise<void> {
    await this.usuarioModel.updateMany(
      { bloqueadosIds: bloqueadoId },
      { $pull: { bloqueadosIds: bloqueadoId } },
    );
  }

  async eliminar(id: string): Promise<void> {
    await this.usuarioModel.deleteOne({ _id: id });
  }
}
