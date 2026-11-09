import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuarioDoc, UsuarioSchema } from './schemas/usuario.schema';
import {
  TokenRecuperacionDoc,
  TokenRecuperacionSchema,
} from './schemas/token-recuperacion.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: UsuarioDoc.name, schema: UsuarioSchema },
      { name: TokenRecuperacionDoc.name, schema: TokenRecuperacionSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [UsersService, AuthService],
})
export class AuthModule {}
