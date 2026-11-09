import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchDoc, MatchSchema } from './schemas/match.schema';
import { InteraccionDoc, InteraccionSchema } from './schemas/interaccion.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: MatchDoc.name, schema: MatchSchema },
      { name: InteraccionDoc.name, schema: InteraccionSchema },
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
