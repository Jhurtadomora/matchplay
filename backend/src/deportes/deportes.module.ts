import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeportesController } from './deportes.controller';
import { DeportesService } from './deportes.service';
import { Deporte, DeporteSchema } from './schemas/deporte.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deporte.name, schema: DeporteSchema }]),
  ],
  controllers: [DeportesController],
  providers: [DeportesService],
  exports: [DeportesService],
})
export class DeportesModule {}
