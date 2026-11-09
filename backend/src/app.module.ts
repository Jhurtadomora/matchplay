import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DeportesModule } from './deportes/deportes.module';
import { PerfilesModule } from './perfiles/perfiles.module';
import { MatchesModule } from './matches/matches.module';
import { EventosModule } from './eventos/eventos.module';
import { ChatsModule } from './chats/chats.module';
import { CuentaModule } from './cuenta/cuenta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/matchplay',
        ),
      }),
    }),
    AuthModule,
    DeportesModule,
    PerfilesModule,
    MatchesModule,
    EventosModule,
    ChatsModule,
    CuentaModule,
  ],
})
export class AppModule {}
