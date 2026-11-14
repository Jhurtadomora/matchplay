import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Deporte } from './schemas/deporte.schema';
import { CrearDeporteDto } from './dto/crear-deporte.dto';
import { ActualizarDeporteDto } from './dto/actualizar-deporte.dto';

/**
 * Catálogo de deportes, persistido en MongoDB (colección "deportes").
 * Igual que el resto de módulos (Auth, Perfiles, Matches, Eventos,
 * Chats, Cuenta), que también guardan sus datos en MongoDB — ver README.
 *
 * Al iniciar, si la colección está vacía, se siembra el catálogo
 * original (los mismos 6 deportes que antes vivían hardcodeados en
 * memoria) para que GET /deportes siga funcionando "out of the box"
 * incluso contra una base de datos recién creada.
 */
@Injectable()
export class DeportesService implements OnModuleInit {
  private readonly logger = new Logger(DeportesService.name);

  // Los mismos 8 deportes y cantidades de la pantalla Explorar del Figma
  private readonly catalogoInicial = [
    { nombre: 'Fútbol 5', disponibles: 412 },
    { nombre: 'Fútbol 11', disponibles: 221 },
    { nombre: 'Baloncesto', disponibles: 198 },
    { nombre: 'Pádel', disponibles: 176 },
    { nombre: 'Tenis', disponibles: 132 },
    { nombre: 'Vóleibol', disponibles: 96 },
    { nombre: 'Natación', disponibles: 64 },
    { nombre: 'Ciclismo', disponibles: 58 },
  ];

  constructor(
    @InjectModel(Deporte.name) private readonly deporteModel: Model<Deporte>,
  ) {}

  async onModuleInit() {
    const total = await this.deporteModel.countDocuments();
    if (total === 0) {
      await this.deporteModel.insertMany(this.catalogoInicial);
      this.logger.log(
        `Colección "deportes" vacía: se sembró el catálogo inicial (${this.catalogoInicial.length} deportes).`,
      );
    }
  }

  async listar(): Promise<Deporte[]> {
    return this.deporteModel.find().sort({ nombre: 1 }).exec();
  }

  async obtenerUno(id: string): Promise<Deporte> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Deporte no encontrado');
    }
    const deporte = await this.deporteModel.findById(id).exec();
    if (!deporte) {
      throw new NotFoundException('Deporte no encontrado');
    }
    return deporte;
  }

  async crear(datos: CrearDeporteDto): Promise<Deporte> {
    const creado = new this.deporteModel({
      nombre: datos.nombre,
      iconoUrl: datos.iconoUrl,
      disponibles: datos.disponibles ?? 0,
    });
    return creado.save();
  }

  async actualizar(id: string, cambios: ActualizarDeporteDto): Promise<Deporte> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Deporte no encontrado');
    }
    const actualizado = await this.deporteModel
      .findByIdAndUpdate(id, { $set: cambios }, { new: true, runValidators: true })
      .exec();
    if (!actualizado) {
      throw new NotFoundException('Deporte no encontrado');
    }
    return actualizado;
  }

  async eliminar(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Deporte no encontrado');
    }
    const eliminado = await this.deporteModel.findByIdAndDelete(id).exec();
    if (!eliminado) {
      throw new NotFoundException('Deporte no encontrado');
    }
  }

  /** Usado por otros módulos para validar que un nombre de deporte exista en el catálogo. */
  async existe(nombre: string): Promise<boolean> {
    const encontrado = await this.deporteModel
      .findOne({ nombre: new RegExp(`^${nombre}$`, 'i') })
      .exec();
    return !!encontrado;
  }
}
