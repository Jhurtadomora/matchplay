import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { EventoDoc, EventoSchema } from './schemas/evento.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: EventoDoc.name, schema: EventoSchema }]),
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}
