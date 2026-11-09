import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { EventosModule } from '../eventos/eventos.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatDoc, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    AuthModule,
    EventosModule,
    MongooseModule.forFeature([{ name: ChatDoc.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
