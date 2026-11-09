import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeportesService } from './deportes.service';
import { CrearDeporteDto } from './dto/crear-deporte.dto';
import { ActualizarDeporteDto } from './dto/actualizar-deporte.dto';

/**
 * GET es público (lo usan Explorar y el selector de "Deporte" sin
 * sesión). Crear/actualizar/borrar requieren estar autenticado.
 * Persistido en MongoDB (colección "deportes").
 */
@Controller('deportes')
export class DeportesController {
  constructor(private readonly deportesService: DeportesService) {}

  @Get()
  listar() {
    return this.deportesService.listar();
  }

  @Get(':id')
  obtenerUno(@Param('id') id: string) {
    return this.deportesService.obtenerUno(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() datos: CrearDeporteDto) {
    return this.deportesService.crear(datos);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() cambios: ActualizarDeporteDto) {
    return this.deportesService.actualizar(id, cambios);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async eliminar(@Param('id') id: string) {
    await this.deportesService.eliminar(id);
  }
}
