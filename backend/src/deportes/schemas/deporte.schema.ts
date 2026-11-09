import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'deportes', timestamps: true })
export class Deporte extends Document {
  @Prop({ required: true, unique: true, trim: true })
  nombre: string;

  @Prop()
  iconoUrl?: string;

  @Prop({ required: true, default: 0, min: 0 })
  disponibles: number;
}

export const DeporteSchema = SchemaFactory.createForClass(Deporte);

DeporteSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    r.id = String(r._id);
    delete r._id;
    return r;
  },
});
