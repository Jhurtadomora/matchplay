import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Match } from './entities/match.entity';
import { MatchDoc } from './schemas/match.schema';
import { InteraccionDoc } from './schemas/interaccion.schema';
import {
  aEntidad,
  aEntidades,
  claveDePar,
  esErrorDeDuplicado,
} from '../common/mongo/mongo.utils';


@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(MatchDoc.name) private readonly matchModel: Model<MatchDoc>,
    @InjectModel(InteraccionDoc.name)
    private readonly interaccionModel: Model<InteraccionDoc>,
  ) {}


  async registrarLike(
    deUsuarioId: string,
    aUsuarioId: string,
  ): Promise<Match | undefined> {
    await this.interaccionModel.updateOne(
      { de: deUsuarioId, a: aUsuarioId },
      { $set: { like: true, pass: false } },
      { upsert: true },
    );

    const par = claveDePar(deUsuarioId, aUsuarioId);
    const existente = await this.matchModel.findOne({ par }).lean();
    if (existente) return aEntidad<Match>(existente);

    const huboLikeReciproco = await this.interaccionModel.exists({
      de: aUsuarioId,
      a: deUsuarioId,
      like: true,
    });
    if (!huboLikeReciproco) return undefined;

    try {
      const creado = await this.matchModel.findOneAndUpdate(
        { par },
        {
          $setOnInsert: {
            _id: `match_${uuid()}`,
            usuarioIdA: deUsuarioId,
            usuarioIdB: aUsuarioId,
            creadoEn: new Date(),
          },
        },
        { upsert: true, new: true },
      ).lean();
      return aEntidad<Match>(creado);
    } catch (error) {
      if (!esErrorDeDuplicado(error)) throw error;
      const ganador = await this.matchModel.findOne({ par }).lean();
      return ganador ? aEntidad<Match>(ganador) : undefined;
    }
  }

  async registrarPass(deUsuarioId: string, aUsuarioId: string): Promise<void> {
    await this.interaccionModel.updateOne(
      { de: deUsuarioId, a: aUsuarioId },
      { $set: { pass: true } },
      { upsert: true },
    );
  }

  async idsDescartadosPor(usuarioId: string): Promise<string[]> {
    const docs = await this.interaccionModel
      .find({ de: usuarioId, pass: true }, { a: 1 })
      .lean();
    return docs.map((d) => d.a);
  }

  async fueDescartado(deUsuarioId: string, aUsuarioId: string): Promise<boolean> {
    const doc = await this.interaccionModel.exists({
      de: deUsuarioId,
      a: aUsuarioId,
      pass: true,
    });
    return Boolean(doc);
  }

  async listarDeUsuario(usuarioId: string): Promise<Match[]> {
    const docs = await this.matchModel
      .find({ $or: [{ usuarioIdA: usuarioId }, { usuarioIdB: usuarioId }] })
      .sort({ creadoEn: 1 })
      .lean();
    return aEntidades<Match>(docs);
  }

  otroParticipante(match: Match, usuarioId: string): string {
    return match.usuarioIdA === usuarioId ? match.usuarioIdB : match.usuarioIdA;
  }

  async eliminar(matchId: string, usuarioId: string): Promise<void> {
    const match = await this.matchModel.findById(matchId).lean();
    if (!match) {
      throw new NotFoundException('Match no encontrado');
    }
    if (match.usuarioIdA !== usuarioId && match.usuarioIdB !== usuarioId) {
      throw new ForbiddenException('Este match no te pertenece');
    }
    await this.matchModel.deleteOne({ _id: matchId });

    await this.interaccionModel.updateMany(
      {
        $or: [
          { de: match.usuarioIdA, a: match.usuarioIdB },
          { de: match.usuarioIdB, a: match.usuarioIdA },
        ],
      },
      { $set: { like: false } },
    );
  }



  async eliminarTodoDeUsuario(usuarioId: string): Promise<void> {
    await this.matchModel.deleteMany({
      $or: [{ usuarioIdA: usuarioId }, { usuarioIdB: usuarioId }],
    });
    await this.interaccionModel.deleteMany({
      $or: [{ de: usuarioId }, { a: usuarioId }],
    });
  }
}
