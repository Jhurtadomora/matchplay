import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MatchesModule } from '../matches/matches.module';
import { ChatsModule } from '../chats/chats.module';
import { EventosModule } from '../eventos/eventos.module';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';

@Module({
  imports: [AuthModule, MatchesModule, ChatsModule, EventosModule],
  controllers: [CuentaController],
  providers: [CuentaService],
})
export class CuentaModule {}
